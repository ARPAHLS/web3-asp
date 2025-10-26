// H3 Aspis Background Service Worker
// Main orchestrator: handles messages, runs AI analysis, manages state

import { isValidAddress, isContract, getTransactionCount, getBalance, getContractSource } from './utils/web3-utils.js';
import { createAnalysisPrompt, parseAIResponse, applyTierGating, createFallbackAnalysis } from './utils/analyzer.js';
import { checkSanctionedWallet, getSanctionsStats } from './data/sanctioned-wallets.js';
import { getTokenSecurity, getChainId } from './utils/goplus-security.js';
import { getTestAddressData } from './data/test-addresses.js';

console.log('[H3 Aspis] Background service worker starting...');

// Configuration
const CONFIG = {
  // RPC endpoints - Using public RPCs
  rpc: {
    ethereum: 'https://cloudflare-eth.com',
    base: 'https://mainnet.base.org',
    polygon: 'https://polygon-rpc.com'
  },
  
  // Explorer APIs
  explorers: {
    ethereum: {
      api: 'https://api.etherscan.io/api',
      key: '' // Will be populated from config
    }
  },
  
  // Feature flags
  features: {
    enableAI: true,
    enableFirebase: false, // Will be configured later
    enableSanctionsCheck: true,
    enableGoPlus: true, // GoPlus token security API
    demoMode: true // All features publicly available for now
  },
  
  // Cache settings
  cache: {
    ttl: 3600000, // 1 hour in milliseconds
    maxSize: 1000
  }
};

// State management
const state = {
  user: {
    tier: 'free',
    isAuthenticated: false,
    email: null,
    settings: {
      historyEnabled: true // Enable history by default in demo mode
    }
  },
  
  analysisCache: new Map(),
  pendingAnalyses: new Map(),
  
  stats: {
    addressesScanned: 0,
    threatsDetected: 0,
    sessionsStarted: Date.now()
  }
};

/**
 * Initialize the background service worker
 */
async function init() {
  console.log('[H3 Aspis] Initializing...');
  
  // Load configuration
  await loadConfiguration();
  
  // Log sanctions database stats
  console.log('[H3 Aspis] Sanctions database:', getSanctionsStats());
  
  // Check Chrome AI availability
  await checkAIAvailability();
  
  // Setup message listeners
  chrome.runtime.onMessage.addListener(handleMessage);
  
  // Setup Firebase auth listener (if enabled)
  if (CONFIG.features.enableFirebase) {
    await setupFirebaseAuth();
  }
  
  console.log('[H3 Aspis] Initialized successfully');
  console.log('[H3 Aspis] Demo mode:', CONFIG.features.demoMode);
  console.log('[H3 Aspis] GoPlus API:', CONFIG.features.enableGoPlus ? 'Enabled' : 'Disabled');
}

/**
 * Load configuration from storage or config file
 */
async function loadConfiguration() {
  try {
    // Try to load from chrome.storage first
    const stored = await chrome.storage.local.get(['config']);
    
    if (stored.config) {
      Object.assign(CONFIG, stored.config);
      console.log('[H3 Aspis] Configuration loaded from storage');
    }
  } catch (error) {
    console.warn('[H3 Aspis] Using default configuration');
  }
}

/**
 * Check if Chrome AI (Gemini Nano) is available
 * NOTE: Gemini Nano is BUILT-IN to Chrome - NO API KEY needed!
 */
async function checkAIAvailability() {
  try {
    console.log('[H3 Aspis] Checking Chrome Built-in AI (Gemini Nano)...');
    console.log('[H3 Aspis] Note: No API key needed - Gemini Nano runs on your device!');
    
    if (typeof chrome.ai === 'undefined' || !chrome.ai.promptApi) {
      console.warn('[H3 Aspis] ❌ Chrome AI API not available');
      console.warn('[H3 Aspis] Are you using Chrome Canary/Dev with flags enabled?');
      console.warn('[H3 Aspis] See GEMINI_NANO_SETUP.md for instructions');
      CONFIG.features.enableAI = false;
      return false;
    }
    
    // Check capabilities
    const capabilities = await chrome.ai.promptApi.capabilities();
    console.log('[H3 Aspis] AI Capabilities:', capabilities);
    
    if (capabilities.available === 'no') {
      console.warn('[H3 Aspis] ❌ Gemini Nano not available on this device');
      console.warn('[H3 Aspis] Requirements: Chrome 127+, Modern CPU, 4GB+ RAM');
      CONFIG.features.enableAI = false;
      return false;
    }
    
    if (capabilities.available === 'after-download') {
      console.log('[H3 Aspis] ⏳ Gemini Nano model needs to download');
      console.log('[H3 Aspis] Go to chrome://components/ and update "Optimization Guide On Device Model"');
      console.log('[H3 Aspis] Download size: ~1.5GB, may take 5-10 minutes');
      CONFIG.features.enableAI = false; // Disable until downloaded
      return false;
    }
    
    if (capabilities.available === 'readily') {
      console.log('[H3 Aspis] ✅ Gemini Nano is ready!');
      console.log('[H3 Aspis] AI-powered analysis enabled');
      return true;
    }
    
    console.log('[H3 Aspis] ✅ Gemini Nano available');
    return true;
    
  } catch (error) {
    console.error('[H3 Aspis] ❌ Error checking AI availability:', error);
    console.error('[H3 Aspis] Extension will work with fallback analysis (GoPlus + basic rules)');
    CONFIG.features.enableAI = false;
    return false;
  }
}

/**
 * Handle messages from content scripts and popup
 */
function handleMessage(message, sender, sendResponse) {
  console.log('[H3 Aspis] Received message:', message.type);
  
  // Handle async messages
  (async () => {
    try {
      let response;
      
      switch (message.type) {
        case 'SCAN_PAGE':
          response = await handleScanPage(message.addresses, message.url, sender.tab.id);
          break;
          
        case 'ANALYZE_SINGLE':
          response = await handleSingleAnalysis(message.address, message.url, sender.tab.id);
          break;
          
        case 'MANUAL_SCAN':
          response = await handleManualScan(message.address);
          break;
          
        case 'GET_USER_INFO':
          response = { user: state.user, stats: state.stats };
          break;
          
        case 'GET_HISTORY':
          response = await handleGetHistory(message.filters);
          break;
          
        case 'CLEAR_CACHE':
          state.analysisCache.clear();
          response = { success: true };
          break;
          
        case 'CLEAR_HISTORY':
          await clearHistory();
          response = { success: true };
          break;
          
        case 'CLEANUP_HISTORY':
          await cleanupHistory();
          response = { success: true };
          break;
          
        case 'SHOW_ADDRESS_DETAILS':
          // Open popup with specific address
          chrome.action.openPopup();
          response = { success: true };
          break;
          
        case 'OPEN_POPUP':
          chrome.action.openPopup();
          response = { success: true };
          break;
          
        default:
          response = { success: false, error: 'Unknown message type' };
      }
      
      sendResponse(response);
      
    } catch (error) {
      console.error('[H3 Aspis] Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  })();
  
  return true; // Keep channel open for async response
}

/**
 * Handle page scan request from content script
 */
async function handleScanPage(addresses, url, tabId) {
  console.log(`[H3 Aspis] Scanning ${addresses.length} addresses from ${url}`);
  
  const results = {};
  
  // Analyze each address
  for (const address of addresses) {
    if (!isValidAddress(address)) {
      console.warn('[H3 Aspis] Invalid address:', address);
      continue;
    }
    
    try {
      const analysis = await analyzeAddress(address);
      results[address] = analysis;
      
      // Update stats
      state.stats.addressesScanned++;
      if (analysis.status === 'red') {
        state.stats.threatsDetected++;
      }
      
    } catch (error) {
      console.error('[H3 Aspis] Error analyzing address:', address, error);
      results[address] = {
        status: 'yellow',
        tooltip: 'Analysis failed - review manually',
        summary: 'Error during analysis'
      };
    }
  }
  
  // Send results back to content script
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'SCAN_RESULTS',
      results: results
    });
  } catch (error) {
    console.error('[H3 Aspis] Error sending results to tab:', error);
  }
  
  return { success: true, count: Object.keys(results).length };
}

/**
 * Handle single address analysis from content script
 */
async function handleSingleAnalysis(address, url, tabId) {
  console.log('[H3 Aspis] Single analysis requested for:', address);
  
  if (!isValidAddress(address)) {
    return { success: false, error: 'Invalid address format' };
  }
  
  try {
    const analysis = await analyzeAddress(address);
    
    // Send result back to specific tab
    await chrome.tabs.sendMessage(tabId, {
      type: 'SINGLE_RESULT',
      address: address,
      result: analysis
    });
    
    // Update stats
    state.stats.addressesScanned++;
    if (analysis.status === 'red') {
      state.stats.threatsDetected++;
    }
    
    return { success: true };
    
  } catch (error) {
    console.error('[H3 Aspis] Error in single analysis:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle manual scan request from popup
 */
async function handleManualScan(address) {
  console.log('[H3 Aspis] Manual scan requested for:', address);
  
  if (!isValidAddress(address)) {
    return { success: false, error: 'Invalid address format' };
  }
  
  const analysis = await analyzeAddress(address);
  
  return {
    success: true,
    result: analysis
  };
}

/**
 * Analyze a single address
 * @param {string} address - Address to analyze
 * @returns {Promise<Object>} Analysis result
 */
async function analyzeAddress(address) {
  address = address.toLowerCase();
  
  // Check cache first
  const cached = state.analysisCache.get(address);
  if (cached && Date.now() - cached.timestamp < CONFIG.cache.ttl) {
    console.log('[H3 Aspis] Using cached analysis for:', address);
    return cached.result;
  }
  
  // Check if already analyzing
  if (state.pendingAnalyses.has(address)) {
    console.log('[H3 Aspis] Analysis already pending for:', address);
    return state.pendingAnalyses.get(address);
  }
  
  // Start analysis
  const analysisPromise = performAnalysis(address);
  state.pendingAnalyses.set(address, analysisPromise);
  
  try {
    const result = await analysisPromise;
    
    // Cache result
    state.analysisCache.set(address, {
      result,
      timestamp: Date.now()
    });
    
    // Clean up pending
    state.pendingAnalyses.delete(address);
    
    // Save to history if enabled (local storage in demo mode)
    if (state.user.settings.historyEnabled) {
      await saveToHistory(address, result);
    }
    
    return result;
    
  } catch (error) {
    state.pendingAnalyses.delete(address);
    throw error;
  }
}

/**
 * Perform the actual analysis of an address
 * @param {string} address
 * @returns {Promise<Object>}
 */
async function performAnalysis(address) {
  console.log('[H3 Aspis] ========== Starting Analysis for', address, '==========');
  
  try {
    // Step 0: Check test dataset first (for demo/testing)
    const testData = getTestAddressData(address);
    if (testData) {
      console.log('[H3 Aspis] 🧪 TEST ADDRESS MATCH:', testData.summary);
      return testData;
    }
    
    // Step 1: Check sanctioned wallets database
    const sanctionsCheck = CONFIG.features.enableSanctionsCheck ? 
      checkSanctionedWallet(address) : null;
    
    if (sanctionsCheck) {
      console.log('[H3 Aspis] ⚠️ SANCTIONS HIT:', sanctionsCheck.name);
      return {
        status: 'red',
        riskLevel: 'critical',
        summary: `🚫 ${sanctionsCheck.name}`,
        reason: sanctionsCheck.reason,
        tooltip: `CRITICAL: ${sanctionsCheck.name} - ${sanctionsCheck.source}`,
        flags: ['sanctions', sanctionsCheck.type, ...sanctionsCheck.tags],
        confidence: 1.0,
        type: sanctionsCheck.type || 'wallet',
        sanctionsData: sanctionsCheck
      };
    }
  
  // Step 2: Determine if contract or wallet
  const rpcUrl = CONFIG.rpc.ethereum; // Default to Ethereum
  const contractCheck = await isContract(address, rpcUrl);
  const type = contractCheck.isContract ? 'contract' : 'wallet';
  
  console.log('[H3 Aspis] Address type:', type, '| Code:', contractCheck.code ? contractCheck.code.substring(0, 20) + '...' : 'none');
  
  // Quick return for regular wallets (not in sanctions = safe/blue)
  if (type === 'wallet') {
    console.log('[H3 Aspis] Regular wallet, no sanctions found - returning BLUE');
    return {
      status: 'blue',
      riskLevel: 'info',
      summary: 'Standard wallet address (EOA). No sanctions match detected.',
      reason: 'External Owned Account with no red flags',
      flags: ['wallet'],
      confidence: 0.8,
      tooltip: 'Wallet - No threats detected',
      type: 'wallet'
    };
  }
  
  // For contracts, continue with deeper analysis
  console.log('[H3 Aspis] Contract detected, continuing with security analysis...');
  
  let contractData = null;
  let goPlusData = null;
  
  // Get contract source if available
  if (CONFIG.explorers.ethereum.key) {
    contractData = await getContractSource(
      address,
      CONFIG.explorers.ethereum.api,
      CONFIG.explorers.ethereum.key
    );
  }
  
  // Step 3.5: GoPlus Security Check (for contracts/tokens)
  if (type === 'contract' && CONFIG.features.enableGoPlus) {
    try {
      console.log('[H3 Aspis] Calling GoPlus API for contract analysis...');
      const chainId = getChainId('ethereum'); // Default to Ethereum
      goPlusData = await getTokenSecurity(address, chainId);
      
      if (goPlusData) {
        console.log('[H3 Aspis] GoPlus analysis complete:', goPlusData.status, '/', goPlusData.riskLevel);
        
        // If GoPlus found critical issues, return immediately
        if (goPlusData.status === 'red' && goPlusData.riskLevel === 'critical') {
          console.log('[H3 Aspis] CRITICAL ISSUE from GoPlus, returning immediately');
          return {
            ...goPlusData,
            type: 'contract',
            tooltip: goPlusData.summary
          };
        }
      } else {
        console.log('[H3 Aspis] GoPlus returned no data for this contract');
      }
    } catch (error) {
      console.warn('[H3 Aspis] GoPlus check failed:', error);
      // Continue to fallback - don't leave stuck
    }
  }
  
  // Step 4: AI Analysis (if available)
  if (CONFIG.features.enableAI) {
    try {
      console.log('[H3 Aspis] Attempting AI analysis...');
      const aiAnalysis = await runAIAnalysis({
        address,
        type,
        balance,
        txCount,
        contractData,
        goPlusData,
        sanctionsData: sanctionsCheck
      });
      
      console.log('[H3 Aspis] AI analysis complete');
      
      // Apply tier gating
      const gatedResult = applyTierGating(
        aiAnalysis,
        state.user.tier,
        CONFIG.features.demoMode
      );
      
      console.log('[H3 Aspis] Returning AI result:', gatedResult.status);
      return gatedResult;
      
    } catch (error) {
      console.warn('[H3 Aspis] AI analysis failed, using fallback:', error.message);
      // Fall through to fallback analysis
    }
  } else {
    console.log('[H3 Aspis] AI disabled, using fallback analysis');
  }
  
  // Step 5: Fallback analysis (when AI unavailable or failed)
  // If we have GoPlus data for a contract, use it
  if (type === 'contract' && goPlusData) {
    console.log('[H3 Aspis] Using GoPlus data as fallback for contract');
    return {
      ...goPlusData,
      type: 'contract',
      tooltip: goPlusData.summary
    };
  }
  
    // Final fallback: basic analysis based on type
    console.log('[H3 Aspis] Using basic fallback analysis for', type);
    const fallbackResult = createFallbackAnalysis(address, type, false);
    console.log('[H3 Aspis] Fallback result:', fallbackResult.status);
    console.log('[H3 Aspis] ========== Analysis Complete ==========');
    return fallbackResult;
    
  } catch (error) {
    // CRITICAL: Ensure we ALWAYS return something, never leave stuck
    console.error('[H3 Aspis] ❌ CRITICAL ERROR in performAnalysis:', error);
    console.error('[H3 Aspis] Returning emergency fallback to prevent stuck state');
    
    return {
      status: 'yellow',
      riskLevel: 'unknown',
      summary: 'Analysis error - review manually',
      reason: `An error occurred during analysis: ${error.message}. Please review this address manually before interacting.`,
      flags: ['error', 'manual_review_needed'],
      confidence: 0,
      tooltip: 'Analysis Failed - Review Manually',
      type: 'unknown',
      error: error.message
    };
  }
}

/**
 * Run AI analysis using Gemini Nano
 * @param {Object} data - Address data for analysis
 * @returns {Promise<Object>}
 */
async function runAIAnalysis(data) {
  console.log('[H3 Aspis] Running AI analysis...');
  
  try {
    // Create prompt
    const prompt = createAnalysisPrompt(
      data,
      state.user.tier,
      false // sanctionsHit handled separately
    );
    
    console.log('[H3 Aspis] Prompt length:', prompt.length);
    
    // Create AI session
    const session = await chrome.ai.promptApi.create({
      temperature: 0.3, // Lower temperature for more consistent results
      topK: 3
    });
    
    // Get response
    const response = await session.prompt(prompt);
    
    console.log('[H3 Aspis] AI response received');
    
    // Clean up session
    await session.destroy();
    
    // Parse response
    const parsed = parseAIResponse(response);
    
    return parsed;
    
  } catch (error) {
    console.error('[H3 Aspis] AI analysis error:', error);
    throw error;
  }
}

/**
 * Save analysis to history (local storage + optional Firebase sync)
 */
async function saveToHistory(address, result) {
  try {
    // Get existing history
    const { scanHistory = [] } = await chrome.storage.local.get(['scanHistory']);
    
    // Create history entry
    const entry = {
      address: address,
      result: result,
      timestamp: Date.now(),
      url: null // Will be set by caller if available
    };
    
    // Add to beginning of array (most recent first)
    scanHistory.unshift(entry);
    
    // Keep only last 1000 entries to avoid storage bloat
    if (scanHistory.length > 1000) {
      scanHistory.splice(1000);
    }
    
    // Save back to storage
    await chrome.storage.local.set({ scanHistory });
    
    console.log('[H3 Aspis] Saved to history:', address);
    
    // If Firebase is enabled, also sync to cloud
    if (CONFIG.features.enableFirebase && state.user.isAuthenticated) {
      // TODO: Sync to Firebase
    }
    
  } catch (error) {
    console.error('[H3 Aspis] Error saving to history:', error);
  }
}

/**
 * Get history (local storage or Firebase)
 */
async function handleGetHistory(filters = {}) {
  try {
    // Always get local history first
    const stored = await chrome.storage.local.get(['scanHistory']);
    let history = stored.scanHistory || [];
    
    // Apply filters if provided
    if (filters.status) {
      history = history.filter(item => item.result.status === filters.status);
    }
    
    if (filters.startDate) {
      history = history.filter(item => item.timestamp >= filters.startDate);
    }
    
    if (filters.endDate) {
      history = history.filter(item => item.timestamp <= filters.endDate);
    }
    
    // Sort by most recent first
    history.sort((a, b) => b.timestamp - a.timestamp);
    
    console.log(`[H3 Aspis] Retrieved ${history.length} history items`);
    
    return { 
      success: true, 
      history: history,
      source: 'local' 
    };
    
  } catch (error) {
    console.error('[H3 Aspis] Error getting history:', error);
    return { success: false, error: error.message, history: [] };
  }
}

/**
 * Setup Firebase authentication (optional)
 */
async function setupFirebaseAuth() {
  try {
    console.log('[H3 Aspis] Firebase is disabled - using local storage only');
    console.log('[H3 Aspis] To enable Firebase:');
    console.log('[H3 Aspis]   1. Copy firebase-config.example.js to firebase-config.js');
    console.log('[H3 Aspis]   2. Fill in your Firebase credentials');
    console.log('[H3 Aspis]   3. Set enableFirebase: true in config.js');
    
    // Firebase is optional - extension works fine without it
    return true;
    
  } catch (error) {
    console.error('[H3 Aspis] Firebase setup error:', error);
    // Don't fail if Firebase isn't configured
    return false;
  }
}

/**
 * Clear all scan history
 */
async function clearHistory() {
  try {
    await chrome.storage.local.remove(['scanHistory']);
    console.log('[H3 Aspis BG] History cleared');
  } catch (error) {
    console.error('[H3 Aspis BG] History clear error:', error);
  }
}

/**
 * Clean up old history based on retention period
 */
async function cleanupHistory() {
  try {
    const { retentionPeriod = 'never', scanHistory = [] } = 
      await chrome.storage.local.get(['retentionPeriod', 'scanHistory']);
    
    if (retentionPeriod === 'never') {
      return; // Keep all history
    }
    
    // Calculate cutoff time
    const now = Date.now();
    let cutoffTime = 0;
    
    switch (retentionPeriod) {
      case '1week':
        cutoffTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        cutoffTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        cutoffTime = now - (90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        cutoffTime = now - (365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return;
    }
    
    // Filter history
    const filteredHistory = scanHistory.filter(item => 
      item.timestamp && item.timestamp > cutoffTime
    );
    
    // Save filtered history
    await chrome.storage.local.set({ scanHistory: filteredHistory });
    
    const removed = scanHistory.length - filteredHistory.length;
    if (removed > 0) {
      console.log(`[H3 Aspis BG] Removed ${removed} old history entries`);
    }
    
  } catch (error) {
    console.error('[H3 Aspis BG] History cleanup error:', error);
  }
}

// Initialize on service worker start
init();

// Run cleanup on startup and periodically
cleanupHistory();
setInterval(() => cleanupHistory(), 24 * 60 * 60 * 1000); // Daily cleanup

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[H3 Aspis] Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // Open welcome page
    chrome.tabs.create({
      url: 'popup.html?welcome=true'
    });
  }
});

