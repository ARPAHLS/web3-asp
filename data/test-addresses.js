/**
 * Test Dataset for H3 Aspis Extension
 * Real-world addresses from sanctioned-wallets.js + known safe addresses
 * Total: 15 addresses covering all risk levels
 */

export const TEST_ADDRESSES = {
  // ========== BLUE - Safe Wallets (Informational) ==========
  
  // 1. Vitalik Buterin's Wallet
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045': {
    status: 'blue',
    riskLevel: 'info',
    summary: 'Known safe wallet - Vitalik Buterin (Ethereum founder)',
    reason: 'Well-known legitimate Ethereum founder wallet',
    flags: ['wallet', 'known_good', 'whale'],
    confidence: 1.0,
    type: 'wallet',
    tooltip: 'Safe - Vitalik Buterin wallet'
  },

  // 2. Binance Hot Wallet
  '0x28c6c06298d514db089934071355e5743bf21d60': {
    status: 'blue',
    riskLevel: 'info',
    summary: 'Binance Hot Wallet - Centralized exchange',
    reason: 'Known Binance exchange hot wallet',
    flags: ['wallet', 'exchange', 'binance', 'cex'],
    confidence: 1.0,
    type: 'wallet',
    tooltip: 'Info - Binance Exchange Wallet'
  },

  // 3. Another Exchange Wallet
  '0x9e32b13ce7f2e80a01932b42553652e053d6ed8e': {
    status: 'blue',
    riskLevel: 'info',
    summary: 'Binance Wallet - Large holder',
    reason: 'Known exchange wallet',
    flags: ['wallet', 'exchange', 'whale'],
    confidence: 0.9,
    type: 'wallet',
    tooltip: 'Info - Exchange wallet'
  },

  // ========== GREEN - Safe Contracts (Verified) ==========
  
  // 4. Uniswap V3 Router
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': {
    status: 'green',
    riskLevel: 'safe',
    summary: 'Verified safe contract - Uniswap V3 SwapRouter02',
    reason: 'Verified and audited DEX router contract',
    flags: ['contract', 'verified', 'defi', 'uniswap'],
    confidence: 1.0,
    type: 'contract',
    tooltip: 'Safe - Uniswap V3 Router (Verified)'
  },

  // 5. USDT Token Contract
  '0xdac17f958d2ee523a2206206994597c13d831ec7': {
    status: 'green',
    riskLevel: 'safe',
    summary: 'Verified token - USDT (Tether)',
    reason: 'Verified stablecoin contract',
    flags: ['contract', 'token', 'stablecoin', 'verified'],
    confidence: 1.0,
    type: 'contract',
    tooltip: 'Safe - USDT Token Contract'
  },

  // ========== YELLOW - Caution (Proceed Carefully) ==========
  
  // 6. ETH2 Deposit Contract
  '0x00000000219ab540356cbb839cbe05303d7705fa': {
    status: 'yellow',
    riskLevel: 'medium',
    summary: 'Ethereum 2.0 Deposit Contract',
    reason: 'Official ETH2 staking deposit contract - use with caution',
    flags: ['contract', 'eth2', 'staking', 'official'],
    confidence: 1.0,
    type: 'contract',
    tooltip: 'Official - ETH2 Deposit Contract'
  },

  // ========== RED - Critical Threats (Sanctioned/Malicious) ==========
  
  // 7. Tornado Cash Router (OFAC Sanctioned)
  '0x910cbd523d972eb0a6f4cae4618ad62622b39dbf': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - Tornado Cash Router (OFAC Sanctioned)',
    reason: 'OFAC sanctioned privacy mixer, laundered over $7 billion',
    flags: ['contract', 'sanctions', 'mixer', 'ofac'],
    confidence: 1.0,
    type: 'mixer',
    tooltip: 'CRITICAL - OFAC Sanctioned',
    sanctionsData: {
      name: 'Tornado Cash Router',
      source: 'OFAC',
      type: 'mixer',
      tags: ['tornado-cash', 'mixer', 'ofac']
    }
  },

  // 8. Tornado Cash 10 ETH Pool (OFAC Sanctioned)
  '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - Tornado Cash 10 ETH (OFAC Sanctioned)',
    reason: 'Tornado Cash 10 ETH pool contract',
    flags: ['contract', 'sanctions', 'mixer', 'ofac'],
    confidence: 1.0,
    type: 'mixer',
    tooltip: 'CRITICAL - OFAC Sanctioned',
    sanctionsData: {
      name: 'Tornado Cash 10 ETH',
      source: 'OFAC',
      type: 'mixer',
      tags: ['tornado-cash', 'mixer', 'ofac']
    }
  },

  // 9. Tornado Cash 100 ETH Pool (OFAC Sanctioned)
  '0x07687e702b410fa43f4cb4af7fa097918ffd2730': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - Tornado Cash 100 ETH (OFAC Sanctioned)',
    reason: 'Tornado Cash 100 ETH pool contract',
    flags: ['contract', 'sanctions', 'mixer', 'ofac'],
    confidence: 1.0,
    type: 'mixer',
    tooltip: 'CRITICAL - OFAC Sanctioned',
    sanctionsData: {
      name: 'Tornado Cash 100 ETH',
      source: 'OFAC',
      type: 'mixer',
      tags: ['tornado-cash', 'mixer', 'ofac']
    }
  },

  // 10. Ronin Bridge Hack - Lazarus Group (FBI)
  '0x098b716b8aaf21512996dc57eb0615e2383e2f96': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - Ronin Bridge Hack (Lazarus Group)',
    reason: 'Ronin Network bridge exploit by North Korean Lazarus Group ($625M stolen)',
    flags: ['hack', 'lazarus', 'north-korea', 'fbi'],
    confidence: 1.0,
    type: 'hack',
    tooltip: 'CRITICAL - FBI Identified Threat',
    sanctionsData: {
      name: 'Ronin Bridge Hack - Lazarus',
      source: 'FBI',
      type: 'hack',
      tags: ['lazarus', 'north-korea', 'ronin', 'hack']
    }
  },

  // 11. Lazarus Group Wallet #1 (FBI)
  '0x94f1b9b64e2932f6a2db338f616844400cd58e8a': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - Lazarus Group (North Korean APT)',
    reason: 'North Korean state-sponsored hacking group',
    flags: ['sanctions', 'lazarus', 'north-korea', 'fbi'],
    confidence: 1.0,
    type: 'sanctions',
    tooltip: 'CRITICAL - FBI Sanctioned',
    sanctionsData: {
      name: 'Lazarus Group',
      source: 'FBI',
      type: 'sanctions',
      tags: ['lazarus', 'north-korea', 'fbi']
    }
  },

  // 12. Hamas Fundraising Wallet (OFAC)
  '0x19aa5fe80d33a56d56c78e82ea5e50e5d80b4dff': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - Hamas Fundraising (OFAC Sanctioned)',
    reason: 'Hamas cryptocurrency fundraising wallet',
    flags: ['terrorism', 'hamas', 'fundraising', 'ofac'],
    confidence: 1.0,
    type: 'terrorism',
    tooltip: 'CRITICAL - Terrorism Financing',
    sanctionsData: {
      name: 'Hamas Fundraising',
      source: 'OFAC',
      type: 'terrorism',
      tags: ['terrorism', 'hamas', 'fundraising', 'ofac']
    }
  },

  // 13. PlusToken Ponzi Scheme
  '0xb794f5ea0ba39494ce839613fffba74279579268': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - PlusToken Ponzi ($2.9B fraud)',
    reason: 'PlusToken Ponzi scheme',
    flags: ['scam', 'ponzi', 'plustoken'],
    confidence: 1.0,
    type: 'scam',
    tooltip: 'CRITICAL - Ponzi Scheme',
    sanctionsData: {
      name: 'PlusToken Ponzi',
      source: 'Chainalysis',
      type: 'scam',
      tags: ['ponzi', 'scam', 'plustoken']
    }
  },

  // 14. Israeli NBCTF Sanctioned Wallet #1
  '0x7eab248c014d1043e54e96ac4f31ec7d9a97ffd3': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - IL-NBCTF Sanctioned (Terrorism Financing)',
    reason: 'Israeli National Bureau for Counter Terror Financing sanctions',
    flags: ['sanctions', 'terrorism', 'nbctf', 'israel'],
    confidence: 1.0,
    type: 'sanctions',
    tooltip: 'CRITICAL - Terrorism Financing',
    sanctionsData: {
      name: 'IL-NBCTF Sanctioned Wallet',
      source: 'Israeli NBCTF',
      type: 'sanctions',
      tags: ['nbctf', 'israel', 'terrorism']
    }
  },

  // 15. Garantex Exchange (Russian Ransomware)
  '0x7f367cc41522ce07553e823bf3be79a889debe1b': {
    status: 'red',
    riskLevel: 'critical',
    summary: '🚫 CRITICAL - Garantex Exchange (OFAC Sanctioned)',
    reason: 'Russian exchange facilitating ransomware payments',
    flags: ['exchange', 'russia', 'ransomware', 'ofac'],
    confidence: 1.0,
    type: 'exchange',
    tooltip: 'CRITICAL - Ransomware Facilitator',
    sanctionsData: {
      name: 'Garantex Exchange',
      source: 'OFAC',
      type: 'exchange',
      tags: ['russia', 'exchange', 'ransomware', 'ofac']
    }
  }
};

/**
 * Check if address exists in test dataset
 * @param {string} address - Address to check
 * @returns {Object|null} - Test data or null
 */
export function getTestAddressData(address) {
  const normalized = address.toLowerCase();
  return TEST_ADDRESSES[normalized] || null;
}

/**
 * Get all test addresses
 * @returns {Array} - Array of test addresses
 */
export function getAllTestAddresses() {
  return Object.keys(TEST_ADDRESSES);
}

