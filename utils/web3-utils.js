// H3 Aspis - Web3 Utilities
// Address validation, RPC calls, and blockchain data fetching

/**
 * Validate if a string is a valid Ethereum address
 * @param {string} address - Address to validate
 * @returns {boolean}
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Check if an address is a smart contract or wallet
 * @param {string} address - Address to check
 * @param {string} rpcUrl - RPC endpoint URL
 * @returns {Promise<{isContract: boolean, code: string}>}
 */
export async function isContract(address, rpcUrl) {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getCode',
        params: [address, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    const code = data.result;
    
    // If code is '0x' or '0x0', it's a wallet (EOA)
    const isContract = code && code !== '0x' && code !== '0x0';
    
    return { isContract, code };
  } catch (error) {
    console.error('[H3 Aspis] Error checking contract:', error);
    return { isContract: false, code: null };
  }
}

/**
 * Get transaction count for an address
 * @param {string} address - Address to check
 * @param {string} rpcUrl - RPC endpoint URL
 * @returns {Promise<number>}
 */
export async function getTransactionCount(address, rpcUrl) {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    return parseInt(data.result, 16);
  } catch (error) {
    console.error('[H3 Aspis] Error getting tx count:', error);
    return 0;
  }
}

/**
 * Get balance for an address
 * @param {string} address - Address to check
 * @param {string} rpcUrl - RPC endpoint URL
 * @returns {Promise<string>} Balance in wei
 */
export async function getBalance(address, rpcUrl) {
  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      })
    });
    
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('[H3 Aspis] Error getting balance:', error);
    return '0x0';
  }
}

/**
 * Get contract source code from block explorer
 * @param {string} address - Contract address
 * @param {string} explorerApi - Explorer API URL
 * @param {string} apiKey - API key
 * @returns {Promise<Object>}
 */
export async function getContractSource(address, explorerApi, apiKey) {
  try {
    const url = `${explorerApi}?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === '1' && data.result && data.result[0]) {
      return {
        sourceCode: data.result[0].SourceCode,
        contractName: data.result[0].ContractName,
        compilerVersion: data.result[0].CompilerVersion,
        optimizationUsed: data.result[0].OptimizationUsed,
        abi: data.result[0].ABI,
        isVerified: data.result[0].SourceCode !== ''
      };
    }
    
    return { isVerified: false };
  } catch (error) {
    console.error('[H3 Aspis] Error getting contract source:', error);
    return { isVerified: false, error: error.message };
  }
}

/**
 * Format wei to ETH with specified decimals
 * @param {string} wei - Wei amount (hex string)
 * @param {number} decimals - Decimal places
 * @returns {string}
 */
export function formatWeiToEth(wei, decimals = 4) {
  const value = parseInt(wei, 16);
  const eth = value / 1e18;
  return eth.toFixed(decimals);
}

/**
 * Shorten address for display
 * @param {string} address - Full address
 * @param {number} startChars - Characters to show at start
 * @param {number} endChars - Characters to show at end
 * @returns {string}
 */
export function shortenAddress(address, startChars = 6, endChars = 4) {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Get chain name from chain ID
 * @param {number} chainId
 * @returns {string}
 */
export function getChainName(chainId) {
  const chains = {
    1: 'Ethereum',
    8453: 'Base',
    137: 'Polygon',
    56: 'BSC',
    42161: 'Arbitrum',
    10: 'Optimism'
  };
  return chains[chainId] || 'Unknown';
}

/**
 * Get explorer URL for address
 * @param {string} address
 * @param {number} chainId
 * @returns {string}
 */
export function getExplorerUrl(address, chainId = 1) {
  const explorers = {
    1: 'https://etherscan.io',
    8453: 'https://basescan.org',
    137: 'https://polygonscan.com',
    56: 'https://bscscan.com',
    42161: 'https://arbiscan.io',
    10: 'https://optimistic.etherscan.io'
  };
  const base = explorers[chainId] || 'https://etherscan.io';
  return `${base}/address/${address}`;
}

