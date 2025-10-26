// H3 Aspis Content Script
// Scans pages for Web3 addresses and highlights them based on security analysis

console.log('[H3 Aspis] Content script loaded');

// Configuration
const SCAN_CONFIG = {
  // Regex patterns for Web3 addresses
  FULL_ADDRESS_REGEX: /\b(0x[a-fA-F0-9]{40})\b/g,
  PARTIAL_ADDRESS_REGEX: /\b(0x[a-fA-F0-9]{2,10}\.{2,3}[a-fA-F0-9]{2,10})\b/g,
  
  // Debounce delay for DOM mutations (ms)
  MUTATION_DEBOUNCE: 500,
  
  // Max addresses to scan per page
  MAX_ADDRESSES: 100,
  
  // Excluded elements (don't scan these)
  EXCLUDED_TAGS: ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT'],
  EXCLUDED_CLASSES: ['h3-aspis-highlight', 'h3-aspis-tooltip']
};

// State management
const state = {
  scannedAddresses: new Set(),
  highlightedNodes: new Map(),
  pendingAnalysis: new Map(), // address -> { nodes: [], status: 'pending' }
  addressbook: new Map(), // address -> { tag, color }
  isScanning: false,
  mutationObserver: null,
  debounceTimer: null,
  addressIdCounter: 0
};

/**
 * Initialize the content script
 */
async function init() {
  console.log('[H3 Aspis] Initializing scanner...');
  
  // Load user's addressbook FIRST (must complete before scanning)
  await loadAddressbook();
  console.log('[H3 Aspis] Addressbook loaded, ready to scan');
  
  // Give a tiny delay to ensure addressbook is fully loaded
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Initial scan (now addressbook is definitely loaded)
  scanPage();
  
  // Watch for dynamic content changes
  observeDOMChanges();
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener(handleMessage);
  
  console.log('[H3 Aspis] Scanner initialized');
}

/**
 * Load user's addressbook from storage
 */
async function loadAddressbook() {
  try {
    const result = await chrome.storage.local.get(['addressbook']);
    console.log('[H3 Aspis] 🔍 RAW storage result:', JSON.stringify(result, null, 2));
    
    if (result.addressbook && Object.keys(result.addressbook).length > 0) {
      state.addressbook = new Map(Object.entries(result.addressbook));
      console.log('[H3 Aspis] ✅ Loaded addressbook:', state.addressbook.size, 'entries');
      console.log('[H3 Aspis] 📖 Addressbook addresses:', Array.from(state.addressbook.keys()));
      
      // Log each entry for debugging
      state.addressbook.forEach((entry, address) => {
        console.log(`[H3 Aspis] 📝 Entry: "${entry.tag}" → ${address}`);
        console.log(`[H3 Aspis] 📝 Entry object:`, JSON.stringify(entry, null, 2));
      });
    } else {
      console.log('[H3 Aspis] ⚠️ No addressbook found in storage');
      state.addressbook = new Map();
    }
    
    console.log('[H3 Aspis] 📊 Final addressbook Map size:', state.addressbook.size);
    console.log('[H3 Aspis] 📊 Final addressbook Map keys:', Array.from(state.addressbook.keys()));
  } catch (error) {
    console.error('[H3 Aspis] ❌ Error loading addressbook:', error);
  }
}

/**
 * Scan the entire page for Web3 addresses
 */
function scanPage() {
  if (state.isScanning) {
    console.log('[H3 Aspis] Scan already in progress, skipping...');
    return;
  }
  
  state.isScanning = true;
  console.log('[H3 Aspis] Starting page scan...');
  
  const addresses = findAddressesInDOM();
  
  if (addresses.length > 0) {
    console.log(`[H3 Aspis] Found ${addresses.length} unique addresses`);
    
    // Analyze each address separately to avoid confusion
    analyzeAddressesSequentially(addresses);
    
  } else {
    console.log('[H3 Aspis] No addresses found on this page');
    state.isScanning = false;
  }
}

/**
 * Analyze addresses one by one with proper separation
 * @param {Array<string>} addresses
 */
async function analyzeAddressesSequentially(addresses) {
  // Get settings once at the start
  const settings = await chrome.storage.local.get(['addressbookSecurityCheck']);
  const doSecurityCheck = settings.addressbookSecurityCheck || false;
  
  for (const address of addresses) {
    try {
      const addressLower = address.toLowerCase();
      console.log(`[H3 Aspis] 🔍 Checking address: ${addressLower}`);
      console.log(`[H3 Aspis] 📚 Current addressbook has ${state.addressbook.size} entries`);
      
      // Check if in addressbook first (BEFORE marking as pending)
      if (state.addressbook.has(addressLower)) {
        const entry = state.addressbook.get(addressLower);
        console.log(`[H3 Aspis] ✅ FOUND in addressbook! Tag: "${entry.tag}", Security check: ${doSecurityCheck}`);
        
        if (!doSecurityCheck) {
          // Just show tag without analysis - no loading state needed
          const result = {
            status: 'addressbook',
            isAddressbook: true,
            tag: entry.tag,
            summary: `📋 ${entry.tag}`,
            tooltip: `Your contact: ${entry.tag}`
          };
          
          console.log(`[H3 Aspis] 💜 Showing purple tag (no security check): ${entry.tag}`);
          highlightAddress(address, result);
          continue; // Skip to next address
        } else {
          // User wants security check for addressbook entries
          console.log(`[H3 Aspis] 🔐 Address in addressbook (with security check): ${entry.tag}`);
          // Will proceed to analysis with tag info
        }
      } else {
        console.log(`[H3 Aspis] ❌ Address NOT in addressbook`);
        console.log(`[H3 Aspis] 🔎 Looking for: ${addressLower}`);
        console.log(`[H3 Aspis] 📋 Have: ${Array.from(state.addressbook.keys()).join(', ')}`);
      }
      
      // Mark as pending and show loading state for addresses that need analysis
      if (!state.pendingAnalysis.has(address)) {
        state.pendingAnalysis.set(address, { 
          status: 'pending', 
          nodes: [],
          id: `h3-addr-${++state.addressIdCounter}`
        });
      }
      
      // Show loading state for this address
      highlightAddress(address, { status: 'loading' });
      
      // Request analysis from background
      await requestAnalysis(address);
      
    } catch (error) {
      console.error(`[H3 Aspis] Error analyzing ${address}:`, error);
      state.pendingAnalysis.delete(address);
    }
  }
  
  state.isScanning = false;
}

/**
 * Request analysis for a single address
 * @param {string} address
 */
function requestAnalysis(address) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({
      type: 'ANALYZE_SINGLE',
      address: address,
      url: window.location.href
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[H3 Aspis] Error analyzing address:', chrome.runtime.lastError);
        resolve();
        return;
      }
      
      if (response && response.success) {
        // Will be handled by message listener when result comes back
        resolve();
      } else {
        state.pendingAnalysis.delete(address);
        resolve();
      }
    });
  });
}

/**
 * Find all Web3 addresses in the DOM
 * @returns {Array<string>} Array of unique addresses
 */
function findAddressesInDOM() {
  const addresses = new Set();
  
  // Method 1: Scan text content
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        // Skip excluded elements
        if (SCAN_CONFIG.EXCLUDED_TAGS.includes(node.parentElement?.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip already highlighted elements
        if (node.parentElement?.classList?.contains('h3-aspis-highlight')) {
          return NodeFilter.FILTER_REJECT;
        }
        
        // Skip empty or very short text
        if (!node.textContent || node.textContent.trim().length < 10) {
          return NodeFilter.FILTER_REJECT;
        }
        
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent;
    
    // Find full addresses
    const fullMatches = text.matchAll(SCAN_CONFIG.FULL_ADDRESS_REGEX);
    for (const match of fullMatches) {
      if (addresses.size < SCAN_CONFIG.MAX_ADDRESSES) {
        addresses.add(match[1].toLowerCase());
      }
    }
  }
  
  // Method 2: Scan element attributes (for truncated/hidden full addresses)
  // Common attributes that might contain full addresses
  const attributesToCheck = [
    'data-address', 'data-account', 'data-token', 'data-contract',
    'href', 'data-href', 'title', 'data-original', 'data-full-address',
    'value', 'data-value', 'data-id'
  ];
  
  const allElements = document.querySelectorAll('*');
  for (const element of allElements) {
    // Skip excluded elements
    if (SCAN_CONFIG.EXCLUDED_TAGS.includes(element.tagName)) continue;
    if (element.classList.contains('h3-aspis-highlight')) continue;
    
    // Check each attribute
    for (const attr of attributesToCheck) {
      const value = element.getAttribute(attr);
      if (value) {
        const matches = value.matchAll(SCAN_CONFIG.FULL_ADDRESS_REGEX);
        for (const match of matches) {
          if (addresses.size < SCAN_CONFIG.MAX_ADDRESSES) {
            addresses.add(match[1].toLowerCase());
          }
        }
      }
    }
    
    // Also check if element text is a shortened address and has title/data-* with full address
    const text = element.textContent?.trim() || '';
    if (SCAN_CONFIG.PARTIAL_ADDRESS_REGEX.test(text)) {
      // This looks like a shortened address, check if full address is in attributes
      for (const attr of attributesToCheck) {
        const value = element.getAttribute(attr);
        if (value && SCAN_CONFIG.FULL_ADDRESS_REGEX.test(value)) {
          const match = value.match(SCAN_CONFIG.FULL_ADDRESS_REGEX);
          if (match && addresses.size < SCAN_CONFIG.MAX_ADDRESSES) {
            addresses.add(match[1].toLowerCase());
          }
        }
      }
    }
  }
  
  return Array.from(addresses);
}

/**
 * Highlight a single address with its result
 * @param {string} address - Address to highlight
 * @param {Object} result - Analysis result
 */
function highlightAddress(address, result) {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (SCAN_CONFIG.EXCLUDED_TAGS.includes(node.parentElement?.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (node.parentElement?.classList?.contains('h3-aspis-highlight')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  const nodesToProcess = [];
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent;
    const regex = new RegExp(address.slice(0, 10), 'i');
    if (regex.test(text)) {
      nodesToProcess.push(walker.currentNode);
    }
  }
  
  // Get unique ID for this address
  const addressData = state.pendingAnalysis.get(address) || {};
  const addressId = addressData.id || `h3-addr-${++state.addressIdCounter}`;
  
  // Process nodes for this specific address
  nodesToProcess.forEach(node => {
    highlightNodeWithResult(node, address, result, addressId);
  });
}

/**
 * Highlight addresses in the DOM based on analysis results
 * @param {Object} results - Map of address -> analysis result
 */
function highlightAddresses(results) {
  console.log('[H3 Aspis] Highlighting addresses...', Object.keys(results).length);
  
  // Highlight each address separately to avoid confusion
  Object.entries(results).forEach(([address, result]) => {
    highlightAddress(address, result);
    state.pendingAnalysis.delete(address);
  });
  
  // Show notification badge
  showScanCompleteBadge(Object.keys(results).length);
}

/**
 * Highlight a single text node with a specific address result
 * @param {Node} node - Text node to process
 * @param {string} targetAddress - Specific address to highlight
 * @param {Object} result - Analysis result for this address
 * @param {string} addressId - Unique ID for this address
 */
function highlightNodeWithResult(node, targetAddress, result, addressId) {
  const text = node.textContent;
  const parent = node.parentElement;
  
  if (!parent) return;
  
  // Find this specific address in the text
  const regex = new RegExp(`\\b(${targetAddress})\\b`, 'gi');
  const matches = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      address: match[1],
      start: match.index,
      end: match.index + match[1].length
    });
  }
  
  if (matches.length === 0) return;
  
  // Create new elements
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  
  matches.forEach(match => {
    // Add text before match
    if (match.start > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.substring(lastIndex, match.start))
      );
    }
    
    // Determine what to display and how
    let displayText = match.address;
    let className = `h3-aspis-highlight`;
    let tooltip = '';
    
    // Check if this is an addressbook entry
    if (result.isAddressbook) {
      displayText = result.tag;
      className += ' h3-aspis-addressbook';
      tooltip = result.tooltip || `Your contact: ${result.tag}`;
    } else if (result.status === 'loading') {
      className += ' h3-aspis-loading';
      tooltip = 'Analyzing...';
    } else {
      className += ` h3-aspis-${result.status}`;
      tooltip = result.tooltip || `${result.status.toUpperCase()}: Click H3 Aspis icon for details`;
    }
    
    // Create highlighted span
    const span = document.createElement('span');
    span.className = className;
    span.textContent = displayText;
    span.title = tooltip;
    span.dataset.address = match.address.toLowerCase();
    span.dataset.addressId = addressId;
    span.dataset.status = result.status || 'unknown';
    
    // Add click handler for detailed view
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showAddressDetails(match.address, match.result);
    });
    
    fragment.appendChild(span);
    lastIndex = match.end;
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
  }
  
  // Replace original node
  try {
    parent.replaceChild(fragment, node);
  } catch (error) {
    console.warn('[H3 Aspis] Error replacing node:', error);
  }
}

/**
 * Show detailed information for an address
 * @param {string} address - Address to show details for
 * @param {Object} result - Analysis result
 */
function showAddressDetails(address, result) {
  console.log('[H3 Aspis] Showing details for:', address);
  
  // Send message to open popup with this address
  chrome.runtime.sendMessage({
    type: 'SHOW_ADDRESS_DETAILS',
    address: address,
    result: result
  });
}

/**
 * Show scan complete notification badge
 * @param {number} count - Number of addresses scanned
 */
function showScanCompleteBadge(count) {
  // Remove existing badge
  const existing = document.getElementById('h3-aspis-scan-badge');
  if (existing) existing.remove();
  
  // Create badge
  const badge = document.createElement('div');
  badge.id = 'h3-aspis-scan-badge';
  badge.className = 'h3-aspis-scan-badge';
  badge.innerHTML = `
    <div class="h3-aspis-scan-badge-icon" style="background: linear-gradient(135deg, #e6e6fa, #d8bfd8);">🛡️</div>
    <div class="h3-aspis-scan-badge-text">
      H3 Aspis scanned ${count} address${count !== 1 ? 'es' : ''}
    </div>
    <span class="h3-aspis-scan-badge-close">×</span>
  `;
  
  // Add close handler
  badge.querySelector('.h3-aspis-scan-badge-close').addEventListener('click', (e) => {
    e.stopPropagation();
    badge.remove();
  });
  
  // Add click handler to open popup
  badge.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_POPUP' });
    badge.remove();
  });
  
  document.body.appendChild(badge);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (badge.parentElement) {
      badge.style.animation = 'slideInUp 0.3s ease reverse';
      setTimeout(() => badge.remove(), 300);
    }
  }, 5000);
}

/**
 * Observe DOM changes for dynamic content
 */
function observeDOMChanges() {
  state.mutationObserver = new MutationObserver((mutations) => {
    // Debounce rapid changes
    clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(() => {
      const hasNewContent = mutations.some(mutation => 
        mutation.addedNodes.length > 0 || 
        mutation.type === 'characterData'
      );
      
      if (hasNewContent) {
        console.log('[H3 Aspis] DOM changed, re-scanning...');
        scanPage();
      }
    }, SCAN_CONFIG.MUTATION_DEBOUNCE);
  });
  
  state.mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

/**
 * Handle messages from background script
 * @param {Object} message - Message object
 * @param {Object} sender - Sender information
 * @param {Function} sendResponse - Response callback
 */
function handleMessage(message, sender, sendResponse) {
  console.log('[H3 Aspis] Received message:', message.type);
  
  switch (message.type) {
    case 'SCAN_RESULTS':
      highlightAddresses(message.results);
      sendResponse({ success: true });
      break;
      
    case 'SINGLE_RESULT':
      // Handle result for a single address
      if (message.address && message.result) {
        highlightAddress(message.address, message.result);
        state.pendingAnalysis.delete(message.address);
      }
      sendResponse({ success: true });
      break;
      
    case 'RESCAN_PAGE':
      state.scannedAddresses.clear();
      state.pendingAnalysis.clear();
      scanPage();
      sendResponse({ success: true });
      break;
      
    case 'CLEAR_HIGHLIGHTS':
      clearAllHighlights();
      sendResponse({ success: true });
      break;
      
    case 'RELOAD_ADDRESSBOOK':
      console.log('[H3 Aspis] Reloading addressbook and rescanning page...');
      loadAddressbook().then(() => {
        // Clear existing highlights before rescanning
        clearAllHighlights();
        state.scannedAddresses.clear();
        state.pendingAnalysis.clear();
        
        // Rescan with updated addressbook
        scanPage();
        sendResponse({ success: true });
      });
      return true; // Async response
      
    default:
      console.warn('[H3 Aspis] Unknown message type:', message.type);
      sendResponse({ success: false, error: 'Unknown message type' });
  }
  
  return true; // Keep channel open for async response
}

/**
 * Clear all highlights from the page
 */
function clearAllHighlights() {
  const highlights = document.querySelectorAll('.h3-aspis-highlight');
  highlights.forEach(span => {
    const text = span.textContent;
    const textNode = document.createTextNode(text);
    span.parentElement?.replaceChild(textNode, span);
  });
  
  state.scannedAddresses.clear();
  console.log('[H3 Aspis] Highlights cleared');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}


