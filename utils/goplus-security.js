// H3 Aspis - GoPlus Security API Integration
// Free token and contract security analysis API

const GOPLUS_API_BASE = 'https://api.gopluslabs.io/api/v1';

/**
 * Get token security information from GoPlus
 * @param {string} address - Token/contract address
 * @param {string} chainId - Chain ID (1=Ethereum, 56=BSC, 137=Polygon, etc.)
 * @returns {Promise<Object>}
 */
export async function getTokenSecurity(address, chainId = '1') {
  try {
    const url = `${GOPLUS_API_BASE}/token_security/${chainId}?contract_addresses=${address.toLowerCase()}`;
    
    // Add 10 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`GoPlus API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.code !== 1 || !data.result) {
      throw new Error('Invalid GoPlus response');
    }
    
    const tokenData = data.result[address.toLowerCase()];
    
    if (!tokenData) {
      return null;
    }
    
    // Parse and normalize the data
    return parseGoPlusData(tokenData);
    
  } catch (error) {
    console.error('[H3 Aspis] GoPlus API error:', error);
    return null;
  }
}

/**
 * Parse GoPlus security data into normalized format
 * @param {Object} data - Raw GoPlus data
 * @returns {Object}
 */
function parseGoPlusData(data) {
  const risks = [];
  const flags = [];
  let riskScore = 0; // 0-100
  
  // Critical security checks
  if (data.is_honeypot === '1') {
    risks.push('Honeypot detected - Cannot sell tokens');
    flags.push('honeypot');
    riskScore += 50;
  }
  
  if (data.is_blacklisted === '1') {
    risks.push('Blacklisted contract');
    flags.push('blacklisted');
    riskScore += 40;
  }
  
  if (data.is_proxy === '1') {
    risks.push('Proxy contract - code can be changed');
    flags.push('proxy');
    riskScore += 15;
  }
  
  if (data.is_mintable === '1') {
    risks.push('Token supply can be increased');
    flags.push('mintable');
    riskScore += 10;
  }
  
  if (data.can_take_back_ownership === '1') {
    risks.push('Ownership can be reclaimed');
    flags.push('ownership_risk');
    riskScore += 20;
  }
  
  if (data.owner_change_balance === '1') {
    risks.push('Owner can change balances');
    flags.push('balance_manipulation');
    riskScore += 30;
  }
  
  if (data.hidden_owner === '1') {
    risks.push('Hidden ownership');
    flags.push('hidden_owner');
    riskScore += 15;
  }
  
  if (data.selfdestruct === '1') {
    risks.push('Contract can self-destruct');
    flags.push('selfdestruct');
    riskScore += 25;
  }
  
  if (data.external_call === '1') {
    risks.push('Makes external calls');
    flags.push('external_call');
    riskScore += 5;
  }
  
  // Tax analysis
  const buyTax = parseFloat(data.buy_tax) || 0;
  const sellTax = parseFloat(data.sell_tax) || 0;
  
  if (buyTax > 10 || sellTax > 10) {
    risks.push(`High tax: Buy ${buyTax}%, Sell ${sellTax}%`);
    flags.push('high_tax');
    riskScore += 15;
  }
  
  if (data.trading_cooldown === '1') {
    risks.push('Trading cooldown enabled');
    flags.push('cooldown');
    riskScore += 10;
  }
  
  if (data.cannot_sell_all === '1') {
    risks.push('Cannot sell all tokens at once');
    flags.push('cannot_sell_all');
    riskScore += 20;
  }
  
  // Ownership concentration
  const holderCount = parseInt(data.holder_count) || 0;
  const lpHolderCount = parseInt(data.lp_holder_count) || 0;
  
  if (holderCount < 10) {
    risks.push('Very few token holders');
    flags.push('low_holders');
    riskScore += 15;
  }
  
  if (lpHolderCount < 3) {
    risks.push('Liquidity concentration risk');
    flags.push('lp_concentration');
    riskScore += 10;
  }
  
  // Determine overall status
  let status, riskLevel;
  
  if (riskScore >= 50 || data.is_honeypot === '1') {
    status = 'red';
    riskLevel = 'critical';
  } else if (riskScore >= 30) {
    status = 'red';
    riskLevel = 'high';
  } else if (riskScore >= 15) {
    status = 'yellow';
    riskLevel = 'medium';
  } else if (riskScore > 0) {
    status = 'yellow';
    riskLevel = 'low';
  } else {
    status = 'green';
    riskLevel = 'safe';
  }
  
  // Build summary
  let summary;
  if (risks.length === 0) {
    summary = `✓ Token appears safe (${data.token_name || 'Token'})`;
  } else if (risks.length === 1) {
    summary = `⚠️ ${risks[0]}`;
  } else {
    summary = `⚠️ ${risks.length} security concerns detected`;
  }
  
  return {
    status,
    riskLevel,
    riskScore,
    summary,
    reason: risks.length > 0 ? risks.join('; ') : 'No significant risks detected',
    flags,
    confidence: 0.9,
    
    // Detailed data
    details: {
      tokenName: data.token_name,
      tokenSymbol: data.token_symbol,
      isHoneypot: data.is_honeypot === '1',
      isBlacklisted: data.is_blacklisted === '1',
      isProxy: data.is_proxy === '1',
      isMintable: data.is_mintable === '1',
      isOpenSource: data.is_open_source === '1',
      
      taxes: {
        buy: buyTax,
        sell: sellTax
      },
      
      holders: {
        total: holderCount,
        lpHolders: lpHolderCount,
        top10HoldingPercent: parseFloat(data.holder_percent) || 0
      },
      
      trading: {
        canSellAll: data.cannot_sell_all !== '1',
        hasCooldown: data.trading_cooldown === '1',
        isWhitelisted: data.is_whitelisted === '1'
      },
      
      ownership: {
        renounced: data.owner_address === '0x0000000000000000000000000000000000000000',
        canTakeBack: data.can_take_back_ownership === '1',
        canChangeBalance: data.owner_change_balance === '1',
        hidden: data.hidden_owner === '1'
      },
      
      contract: {
        hasSelfdestruct: data.selfdestruct === '1',
        hasExternalCall: data.external_call === '1',
        isVerified: data.is_open_source === '1'
      }
    },
    
    // Raw data for reference
    raw: data
  };
}

/**
 * Get address security analysis (for any address type)
 * @param {string} address
 * @param {string} chainId
 * @returns {Promise<Object>}
 */
export async function getAddressSecurity(address, chainId = '1') {
  try {
    const url = `${GOPLUS_API_BASE}/address_security/${address}?chain_id=${chainId}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    
    if (data.code !== 1 || !data.result) {
      return null;
    }
    
    return {
      isContract: data.result.contract === '1',
      isEOA: data.result.contract === '0',
      hasRisk: data.result.trust_list === '0',
      riskInfo: data.result
    };
    
  } catch (error) {
    console.error('[H3 Aspis] GoPlus address check error:', error);
    return null;
  }
}

/**
 * Get supported chains list
 * @returns {Array<Object>}
 */
export function getSupportedChains() {
  return [
    { id: '1', name: 'Ethereum', symbol: 'ETH' },
    { id: '56', name: 'BSC', symbol: 'BNB' },
    { id: '137', name: 'Polygon', symbol: 'MATIC' },
    { id: '250', name: 'Fantom', symbol: 'FTM' },
    { id: '43114', name: 'Avalanche', symbol: 'AVAX' },
    { id: '42161', name: 'Arbitrum', symbol: 'ETH' },
    { id: '10', name: 'Optimism', symbol: 'ETH' },
    { id: '8453', name: 'Base', symbol: 'ETH' }
  ];
}

/**
 * Map common chain names to GoPlus chain IDs
 * @param {string} chainName
 * @returns {string}
 */
export function getChainId(chainName) {
  const mapping = {
    'ethereum': '1',
    'eth': '1',
    'bsc': '56',
    'binance': '56',
    'polygon': '137',
    'matic': '137',
    'fantom': '250',
    'ftm': '250',
    'avalanche': '43114',
    'avax': '43114',
    'arbitrum': '42161',
    'arb': '42161',
    'optimism': '10',
    'op': '10',
    'base': '8453'
  };
  
  return mapping[chainName.toLowerCase()] || '1';
}

