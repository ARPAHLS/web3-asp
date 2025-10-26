// H3 Aspis Popup Script
// Dashboard logic and user interactions

console.log('[H3 Aspis Popup] Loading...');

// State
const state = {
  currentTab: 'scan',
  user: null,
  stats: { addressesScanned: 0, threatsDetected: 0, safeFound: 0 },
  currentScanResult: null
};

/**
 * Initialize popup
 */
async function init() {
  console.log('[H3 Aspis Popup] Initializing...');
  
  // Setup tab navigation
  setupTabs();
  
  // Setup scan tab
  setupScanTab();
  
  // Setup page tab
  setupPageTab();
  
  // Setup history tab
  setupHistoryTab();
  
  // Setup settings tab
  setupSettingsTab();
  
  // Load user info
  await loadUserInfo();
  
  // Load stats
  await loadStats();
  
  console.log('[H3 Aspis Popup] Initialized');
}

/**
 * Setup tab navigation
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      switchTab(targetTab);
    });
  });
}

/**
 * Switch to a specific tab
 * @param {string} tabName - Tab identifier
 */
function switchTab(tabName) {
  // Update state
  state.currentTab = tabName;
  
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    } else {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });
  
  // Update tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    if (panel.id === `tab-${tabName}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
  
  // Load tab-specific data
  if (tabName === 'history') {
    loadHistory();
  } else if (tabName === 'page') {
    loadCurrentPageData();
  }
}

/**
 * Setup scan tab functionality
 */
function setupScanTab() {
  const input = document.getElementById('manual-address-input');
  const scanBtn = document.getElementById('manual-scan-btn');
  const resultCard = document.getElementById('scan-result');
  const loadingState = document.getElementById('scan-loading');
  
  // Scan button handler
  scanBtn.addEventListener('click', async () => {
    const address = input.value.trim();
    
    if (!address) {
      showNotification('Please enter an address', 'warning');
      return;
    }
    
    if (!isValidAddress(address)) {
      showNotification('Invalid address format', 'error');
      return;
    }
    
    await performManualScan(address);
  });
  
  // Enter key handler
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      scanBtn.click();
    }
  });
}

/**
 * Perform manual address scan
 * @param {string} address - Address to scan
 */
async function performManualScan(address) {
  const resultCard = document.getElementById('scan-result');
  const loadingState = document.getElementById('scan-loading');
  
  // Show loading
  resultCard.classList.add('hidden');
  loadingState.classList.remove('hidden');
  
  try {
    // Send message to background
    const response = await chrome.runtime.sendMessage({
      type: 'MANUAL_SCAN',
      address: address
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Scan failed');
    }
    
    // Display result
    displayScanResult(response.result, address);
    
    // Update stats
    state.stats.addressesScanned++;
    if (response.result.status === 'red') {
      state.stats.threatsDetected++;
    } else if (response.result.status === 'green') {
      state.stats.safeFound++;
    }
    updateStatsDisplay();
    
  } catch (error) {
    console.error('[H3 Aspis Popup] Scan error:', error);
    showNotification('Scan failed: ' + error.message, 'error');
  } finally {
    loadingState.classList.add('hidden');
  }
}

/**
 * Display scan result in UI
 * @param {Object} result - Analysis result
 * @param {string} address - Scanned address
 */
function displayScanResult(result, address) {
  const resultCard = document.getElementById('scan-result');
  const badge = document.getElementById('result-badge');
  const addressEl = document.getElementById('result-address');
  const title = document.getElementById('result-title');
  const description = document.getElementById('result-description');
  const type = document.getElementById('result-type');
  const risk = document.getElementById('result-risk');
  const confidence = document.getElementById('result-confidence');
  const fullAnalysis = document.getElementById('result-full-analysis');
  
  // Update badge
  badge.className = `result-badge ${result.status}`;
  badge.textContent = result.status.toUpperCase();
  
  // Update address
  addressEl.textContent = shortenAddress(address);
  addressEl.title = address;
  
  // Update content
  title.textContent = result.summary || 'Analysis Complete';
  description.textContent = result.reason || 'No additional information';
  
  // Update metadata
  type.textContent = result.type || 'Unknown';
  risk.textContent = result.riskLevel || 'Unknown';
  confidence.textContent = result.confidence ? 
    `${(result.confidence * 100).toFixed(0)}%` : 'N/A';
  
  // Update full analysis
  fullAnalysis.innerHTML = formatFullAnalysis(result);
  
  // Show card
  resultCard.classList.remove('hidden');
  
  // Save to state
  state.currentScanResult = { result, address };
}

/**
 * Format full analysis details
 * @param {Object} result
 * @returns {string} HTML string
 */
function formatFullAnalysis(result) {
  let html = '';
  
  if (result.flags && result.flags.length > 0) {
    html += '<p><strong>Flags:</strong></p><ul>';
    result.flags.forEach(flag => {
      html += `<li>${flag.replace(/_/g, ' ')}</li>`;
    });
    html += '</ul>';
  }
  
  if (result.sanctionsData) {
    html += `<p><strong>Sanctions Information:</strong></p>`;
    html += `<p><strong>Source:</strong> ${result.sanctionsData.source}</p>`;
    html += `<p><strong>Label:</strong> ${result.sanctionsData.label}</p>`;
    if (result.sanctionsData.reason) {
      html += `<p><strong>Reason:</strong> ${result.sanctionsData.reason}</p>`;
    }
  }
  
  if (result.isGated) {
    html += `<p style="margin-top: 12px; padding: 12px; background: rgba(255, 215, 0, 0.1); border-radius: 8px;">
      ⚠️ <strong>Limited Analysis:</strong> Upgrade to H3 Aspis Pro for full security details.
    </p>`;
  }
  
  if (!html) {
    html = '<p>No additional details available.</p>';
  }
  
  return html;
}

/**
 * Setup page tab functionality
 */
function setupPageTab() {
  const rescanBtn = document.getElementById('rescan-page-btn');
  const clearBtn = document.getElementById('clear-highlights-btn');
  
  rescanBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.tabs.sendMessage(tab.id, { type: 'RESCAN_PAGE' });
      
      showNotification('Page rescanned', 'success');
      setTimeout(() => loadCurrentPageData(), 500);
      
    } catch (error) {
      console.error('[H3 Aspis Popup] Rescan error:', error);
      showNotification('Failed to rescan page', 'error');
    }
  });
  
  clearBtn.addEventListener('click', async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      await chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_HIGHLIGHTS' });
      
      showNotification('Highlights cleared', 'success');
      loadCurrentPageData();
      
    } catch (error) {
      console.error('[H3 Aspis Popup] Clear error:', error);
      showNotification('Failed to clear highlights', 'error');
    }
  });
}

/**
 * Load current page analysis data
 */
async function loadCurrentPageData() {
  const listEl = document.getElementById('page-addresses-list');
  
  // For now, show empty state
  // In production, this would fetch from background script
  listEl.innerHTML = `
    <div class="empty-state">
      <span class="empty-icon">🔍</span>
      <p>No addresses detected yet</p>
      <p class="empty-hint">Visit a Web3 site or DApp</p>
    </div>
  `;
}

/**
 * Setup history tab functionality
 */
function setupHistoryTab() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Load filtered history
      const filter = btn.dataset.filter;
      loadHistory(filter);
    });
  });
}

/**
 * Load scan history
 * @param {string} filter - Time filter (all, today, week, month)
 */
async function loadHistory(filter = 'all') {
  const listEl = document.getElementById('history-list');
  
  try {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_HISTORY',
      filters: { timeRange: filter }
    });
    
    if (response.success && response.history && response.history.length > 0) {
      listEl.innerHTML = response.history.map(item => 
        createHistoryItemHTML(item)
      ).join('');
    } else {
      listEl.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📜</span>
          <p>No history yet</p>
          <p class="empty-hint">Scan some addresses to get started</p>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('[H3 Aspis Popup] History load error:', error);
    listEl.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">⚠️</span>
        <p>Failed to load history</p>
      </div>
    `;
  }
}

/**
 * Create HTML for history item
 * @param {Object} item
 * @returns {string}
 */
function createHistoryItemHTML(item) {
  return `
    <div class="address-item" data-address="${item.address}">
      <div class="result-header">
        <span class="result-badge ${item.status}">${item.status.toUpperCase()}</span>
        <span class="result-address">${shortenAddress(item.address)}</span>
      </div>
      <p style="font-size: 12px; color: var(--color-text-secondary); margin-top: 8px;">
        ${item.summary || 'No summary available'}
      </p>
    </div>
  `;
}

/**
 * Setup settings tab functionality
 */
function setupSettingsTab() {
  // Auth button
  const authBtn = document.getElementById('auth-btn');
  authBtn.addEventListener('click', handleAuth);
  
  // History toggle
  const historyToggle = document.getElementById('history-toggle');
  historyToggle.addEventListener('change', async (e) => {
    await chrome.storage.local.set({ historyEnabled: e.target.checked });
    showNotification('Setting saved', 'success');
  });
  
  // Auto-scan toggle
  const autoScanToggle = document.getElementById('auto-scan-toggle');
  autoScanToggle.addEventListener('change', async (e) => {
    await chrome.storage.local.set({ autoScanEnabled: e.target.checked });
    showNotification('Setting saved', 'success');
  });
  
  // Addressbook functionality
  setupAddressbook();
  
  // Audit trail functionality
  setupAuditTrail();
  
  // Clear cache
  const clearCacheBtn = document.getElementById('clear-cache-btn');
  clearCacheBtn.addEventListener('click', async () => {
    await chrome.runtime.sendMessage({ type: 'CLEAR_CACHE' });
    showNotification('Cache cleared', 'success');
  });
  
  // Load current settings
  loadSettings();
}

/**
 * Handle authentication
 */
async function handleAuth() {
  // TODO: Implement Firebase auth with Google
  showNotification('Authentication not yet implemented', 'info');
}

/**
 * Setup addressbook functionality
 */
function setupAddressbook() {
  const addBtn = document.getElementById('addressbook-add-btn');
  const addressInput = document.getElementById('addressbook-address-input');
  const tagInput = document.getElementById('addressbook-tag-input');
  const securityToggle = document.getElementById('addressbook-security-toggle');
  const syncSelect = document.getElementById('addressbook-sync-select');
  const exportBtn = document.getElementById('addressbook-export-btn');
  const importBtn = document.getElementById('addressbook-import-btn');
  
  // Add contact
  addBtn.addEventListener('click', async () => {
    const address = addressInput.value.trim();
    const tag = tagInput.value.trim();
    
    if (!address || !tag) {
      showNotification('Please enter both address and tag', 'warning');
      return;
    }
    
    if (!isValidAddress(address)) {
      showNotification('Invalid address format', 'error');
      return;
    }
    
    try {
      // Get current addressbook
      const { addressbook = {} } = await chrome.storage.local.get(['addressbook']);
      
      // Add new entry
      addressbook[address.toLowerCase()] = {
        tag: tag,
        address: address,
        addedAt: Date.now()
      };
      
      // Save
      await chrome.storage.local.set({ addressbook });
      
      // Clear inputs
      addressInput.value = '';
      tagInput.value = '';
      
      // Reload list
      loadAddressbook();
      
      // Notify content scripts to reload addressbook
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        chrome.tabs.sendMessage(tab.id, { type: 'RELOAD_ADDRESSBOOK' }).catch(() => {});
      }
      
      showNotification('Contact added successfully', 'success');
    } catch (error) {
      console.error('[Addressbook] Add error:', error);
      showNotification('Failed to add contact', 'error');
    }
  });
  
  // Security check toggle
  securityToggle.addEventListener('change', async (e) => {
    await chrome.storage.local.set({ addressbookSecurityCheck: e.target.checked });
    showNotification('Setting saved', 'success');
    
    // Notify content scripts
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'RELOAD_ADDRESSBOOK' }).catch(() => {});
    }
  });
  
  // Sync settings
  syncSelect.addEventListener('change', async (e) => {
    const syncMode = e.target.value;
    
    if (syncMode === 'cloud') {
      showNotification('Cloud sync coming soon', 'info');
      e.target.value = 'local';
      return;
    }
    
    await chrome.storage.local.set({ addressbookSync: syncMode });
    showNotification('Sync setting saved', 'success');
  });
  
  // Export
  exportBtn.addEventListener('click', async () => {
    try {
      const { addressbook = {} } = await chrome.storage.local.get(['addressbook']);
      const dataStr = JSON.stringify(addressbook, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `h3-aspis-addressbook-${Date.now()}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      showNotification('Addressbook exported', 'success');
    } catch (error) {
      console.error('[Addressbook] Export error:', error);
      showNotification('Failed to export', 'error');
    }
  });
  
  // Import
  importBtn.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        
        // Validate data
        if (typeof importedData !== 'object') {
          throw new Error('Invalid format');
        }
        
        // Get current addressbook
        const { addressbook = {} } = await chrome.storage.local.get(['addressbook']);
        
        // Merge
        const merged = { ...addressbook, ...importedData };
        
        // Save
        await chrome.storage.local.set({ addressbook: merged });
        
        // Reload
        loadAddressbook();
        
        // Notify content scripts
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          chrome.tabs.sendMessage(tab.id, { type: 'RELOAD_ADDRESSBOOK' }).catch(() => {});
        }
        
        showNotification('Addressbook imported', 'success');
      } catch (error) {
        console.error('[Addressbook] Import error:', error);
        showNotification('Failed to import', 'error');
      }
    };
    
    input.click();
  });
  
  // Load addressbook
  loadAddressbook();
}

/**
 * Load and display addressbook
 */
async function loadAddressbook() {
  try {
    const { addressbook = {}, addressbookSecurityCheck = false } = 
      await chrome.storage.local.get(['addressbook', 'addressbookSecurityCheck']);
    
    const listEl = document.getElementById('addressbook-list');
    const countEl = document.getElementById('addressbook-count');
    const securityToggle = document.getElementById('addressbook-security-toggle');
    
    // Update toggle
    securityToggle.checked = addressbookSecurityCheck;
    
    const entries = Object.values(addressbook);
    countEl.textContent = entries.length;
    
    if (entries.length === 0) {
      listEl.innerHTML = '<p style="text-align: center; color: var(--color-text-light); padding: 20px;">No contacts yet</p>';
      return;
    }
    
    // Sort by most recent
    entries.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    
    listEl.innerHTML = entries.map(entry => `
      <div class="addressbook-item" data-address="${entry.address}">
        <div class="addressbook-item-info">
          <div class="addressbook-tag">${escapeHtml(entry.tag)}</div>
          <div class="addressbook-address">${shortenAddress(entry.address)}</div>
        </div>
        <div class="addressbook-item-actions">
          <button class="addressbook-btn-icon addressbook-copy-btn" data-address="${entry.address}" title="Copy Address">
            📋
          </button>
          <button class="addressbook-btn-icon addressbook-delete-btn" data-address="${entry.address}" title="Delete">
            🗑️
          </button>
        </div>
      </div>
    `).join('');
    
    // Add event listeners to buttons (can't use inline onclick due to CSP)
    listEl.querySelectorAll('.addressbook-copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        const address = button.dataset.address;
        copyToClipboardWithFeedback(address, button);
      });
    });
    
    listEl.querySelectorAll('.addressbook-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const address = e.target.closest('button').dataset.address;
        const entry = Object.values(addressbook).find(e => e.address === address);
        showDeleteConfirmation(address, entry?.tag || 'this contact');
      });
    });
    
  } catch (error) {
    console.error('[Addressbook] Load error:', error);
  }
}

/**
 * Show branded delete confirmation modal
 * @param {string} address
 * @param {string} tag
 */
function showDeleteConfirmation(address, tag) {
  // Create modal overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">🗑️</span>
        <h3 class="modal-title">Remove Contact?</h3>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to remove <strong>${escapeHtml(tag)}</strong> from your addressbook?</p>
        <p style="font-size: 12px; margin-top: 8px; color: var(--color-text-light);">
          ${shortenAddress(address)}
        </p>
      </div>
      <div class="modal-actions">
        <button class="modal-btn modal-btn-cancel">Cancel</button>
        <button class="modal-btn modal-btn-confirm">Remove</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Cancel button
  overlay.querySelector('.modal-btn-cancel').addEventListener('click', () => {
    overlay.remove();
  });
  
  // Confirm button
  overlay.querySelector('.modal-btn-confirm').addEventListener('click', async () => {
    overlay.remove();
    await deleteAddressbookEntry(address);
  });
  
  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
}

/**
 * Delete addressbook entry (internal function)
 * @param {string} address
 */
async function deleteAddressbookEntry(address) {
  try {
    const { addressbook = {} } = await chrome.storage.local.get(['addressbook']);
    delete addressbook[address.toLowerCase()];
    await chrome.storage.local.set({ addressbook });
    
    loadAddressbook();
    
    // Notify content scripts
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      chrome.tabs.sendMessage(tab.id, { type: 'RELOAD_ADDRESSBOOK' }).catch(() => {});
    }
    
    showNotification('Contact removed', 'success');
  } catch (error) {
    console.error('[Addressbook] Delete error:', error);
    showNotification('Failed to remove contact', 'error');
  }
}

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text
 * @param {HTMLElement} button
 */
function copyToClipboardWithFeedback(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    // Add copied class for animation
    button.classList.add('copied');
    
    // Show tooltip notification
    showNotification('Address copied to clipboard', 'success');
    
    // Remove class after animation
    setTimeout(() => {
      button.classList.remove('copied');
    }, 1200);
  }).catch(() => {
    showNotification('Failed to copy', 'error');
  });
}

/**
 * Setup audit trail functionality
 */
function setupAuditTrail() {
  const storageSelect = document.getElementById('audit-trail-storage-select');
  const retentionSelect = document.getElementById('retention-period-select');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  
  // Storage setting
  storageSelect.addEventListener('change', async (e) => {
    const storageMode = e.target.value;
    
    if (storageMode === 'cloud') {
      showNotification('Cloud sync coming soon', 'info');
      e.target.value = 'local';
      return;
    }
    
    if (storageMode === 'none') {
      if (!confirm('This will clear all existing history. Continue?')) {
        e.target.value = 'local';
        return;
      }
      
      // Clear history
      await chrome.runtime.sendMessage({ type: 'CLEAR_HISTORY' });
    }
    
    await chrome.storage.local.set({ auditTrailStorage: storageMode });
    showNotification('Storage setting saved', 'success');
  });
  
  // Retention period
  retentionSelect.addEventListener('change', async (e) => {
    const retentionPeriod = e.target.value;
    await chrome.storage.local.set({ retentionPeriod });
    
    // Trigger cleanup
    await chrome.runtime.sendMessage({ type: 'CLEANUP_HISTORY' });
    
    showNotification('Retention setting saved', 'success');
  });
  
  // Clear history
  clearHistoryBtn.addEventListener('click', async () => {
    if (!confirm('This will permanently delete all scan history. Continue?')) {
      return;
    }
    
    try {
      await chrome.runtime.sendMessage({ type: 'CLEAR_HISTORY' });
      showNotification('History cleared', 'success');
      
      // Reload history tab if active
      if (state.currentTab === 'history') {
        loadHistory();
      }
    } catch (error) {
      console.error('[Audit Trail] Clear error:', error);
      showNotification('Failed to clear history', 'error');
    }
  });
  
  // Load settings
  loadAuditTrailSettings();
}

/**
 * Load audit trail settings
 */
async function loadAuditTrailSettings() {
  try {
    const { auditTrailStorage = 'local', retentionPeriod = 'never' } = 
      await chrome.storage.local.get(['auditTrailStorage', 'retentionPeriod']);
    
    document.getElementById('audit-trail-storage-select').value = auditTrailStorage;
    document.getElementById('retention-period-select').value = retentionPeriod;
  } catch (error) {
    console.error('[Audit Trail] Load settings error:', error);
  }
}

/**
 * Load user settings
 */
async function loadSettings() {
  const settings = await chrome.storage.local.get(['historyEnabled', 'autoScanEnabled']);
  
  document.getElementById('history-toggle').checked = settings.historyEnabled || false;
  document.getElementById('auto-scan-toggle').checked = settings.autoScanEnabled !== false;
}

/**
 * Export history data
 */
async function exportHistory() {
  // TODO: Implement history export
  showNotification('Export feature coming soon', 'info');
}

/**
 * Load user info from background
 */
async function loadUserInfo() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_USER_INFO' });
    
    if (response && response.user) {
      state.user = response.user;
      updateUserDisplay();
    }
    
    if (response && response.stats) {
      state.stats = response.stats;
      updateStatsDisplay();
    }
    
  } catch (error) {
    console.error('[H3 Aspis Popup] Failed to load user info:', error);
  }
}

/**
 * Update user display in settings
 */
function updateUserDisplay() {
  const userEmail = document.getElementById('user-email');
  const userTier = document.getElementById('user-tier');
  const authBtn = document.getElementById('auth-btn');
  const userInfo = document.getElementById('user-info');
  
  if (state.user && state.user.isAuthenticated) {
    userEmail.textContent = state.user.email || 'Logged in';
    userTier.textContent = state.user.tier === 'paid' ? 'Pro' : 'Free';
    authBtn.innerHTML = '<span class="btn-icon">🚪</span><span class="btn-text">Sign Out</span>';
    userInfo.classList.remove('hidden');
  } else {
    userInfo.classList.add('hidden');
    authBtn.innerHTML = '<span class="btn-icon">🔐</span><span class="btn-text">Sign in with Google</span>';
  }
}

/**
 * Load and display stats
 */
async function loadStats() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_USER_INFO' });
    
    if (response && response.stats) {
      state.stats = response.stats;
      updateStatsDisplay();
    }
  } catch (error) {
    console.error('[H3 Aspis Popup] Failed to load stats:', error);
  }
}

/**
 * Update stats display
 */
function updateStatsDisplay() {
  document.getElementById('stat-scanned').textContent = state.stats.addressesScanned || 0;
  document.getElementById('stat-threats').textContent = state.stats.threatsDetected || 0;
  document.getElementById('stat-safe').textContent = state.stats.safeFound || 0;
}

/**
 * Show notification
 * @param {string} message
 * @param {string} type - success, error, warning, info
 */
function showNotification(message, type = 'info') {
  // Simple console log for now
  // In production, this would show a toast notification
  console.log(`[${type.toUpperCase()}] ${message}`);
  
  // Update status badge temporarily
  const statusBadge = document.getElementById('status-badge');
  const statusText = statusBadge.querySelector('.status-text');
  const originalText = statusText.textContent;
  
  statusText.textContent = message;
  setTimeout(() => {
    statusText.textContent = originalText;
  }, 3000);
}

/**
 * Validate Ethereum address format
 * @param {string} address
 * @returns {boolean}
 */
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Shorten address for display
 * @param {string} address
 * @returns {string}
 */
function shortenAddress(address) {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

