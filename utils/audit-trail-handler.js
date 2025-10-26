// H3 Aspis - Audit Trail Handler
// Manages scan history storage and retention settings

/**
 * Get audit trail storage setting
 * @returns {Promise<string>} 'cloud' | 'local' | 'none'
 */
export async function getAuditTrailStorage() {
  try {
    const result = await chrome.storage.local.get(['auditTrailStorage']);
    return result.auditTrailStorage || 'local';
  } catch (error) {
    return 'local';
  }
}

/**
 * Set audit trail storage setting
 * @param {string} setting - 'cloud' | 'local' | 'none'
 * @returns {Promise<boolean>}
 */
export async function setAuditTrailStorage(setting) {
  try {
    await chrome.storage.local.set({ auditTrailStorage: setting });
    
    if (setting === 'cloud') {
      // TODO: Enable Firebase sync
      await syncHistoryToCloud();
    } else if (setting === 'none') {
      // Clear local history
      await clearLocalHistory();
    }
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error setting audit trail storage:', error);
    return false;
  }
}

/**
 * Get auto-delete retention period
 * @returns {Promise<string>} '1week' | '1month' | '3months' | '1year' | 'never'
 */
export async function getRetentionPeriod() {
  try {
    const result = await chrome.storage.local.get(['retentionPeriod']);
    return result.retentionPeriod || 'never';
  } catch (error) {
    return 'never';
  }
}

/**
 * Set auto-delete retention period
 * @param {string} period - '1week' | '1month' | '3months' | '1year' | 'never'
 * @returns {Promise<boolean>}
 */
export async function setRetentionPeriod(period) {
  try {
    await chrome.storage.local.set({ retentionPeriod: period });
    
    // Trigger cleanup of old entries
    await cleanupOldHistory();
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error setting retention period:', error);
    return false;
  }
}

/**
 * Save scan result to history
 * @param {string} address
 * @param {Object} result
 * @param {string} url
 * @returns {Promise<boolean>}
 */
export async function saveToHistory(address, result, url) {
  try {
    const storage = await getAuditTrailStorage();
    
    if (storage === 'none') {
      return false; // User doesn't want history
    }
    
    // Save to local storage
    const history = await getLocalHistory();
    
    history[address.toLowerCase()] = {
      address: address.toLowerCase(),
      result,
      url,
      timestamp: Date.now(),
      scanCount: (history[address.toLowerCase()]?.scanCount || 0) + 1
    };
    
    await chrome.storage.local.set({ scanHistory: history });
    
    // If cloud sync is enabled, sync to Firebase
    if (storage === 'cloud') {
      await syncHistoryToCloud();
    }
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error saving to history:', error);
    return false;
  }
}

/**
 * Get local history
 * @returns {Promise<Object>}
 */
export async function getLocalHistory() {
  try {
    const result = await chrome.storage.local.get(['scanHistory']);
    return result.scanHistory || {};
  } catch (error) {
    console.error('[H3 Aspis] Error getting history:', error);
    return {};
  }
}

/**
 * Get history filtered by time range
 * @param {string} range - 'today' | 'week' | 'month' | 'all'
 * @returns {Promise<Array>}
 */
export async function getHistoryByRange(range) {
  try {
    const history = await getLocalHistory();
    const now = Date.now();
    const entries = Object.values(history);
    
    // Calculate cutoff time
    let cutoff = 0;
    switch (range) {
      case 'today':
        cutoff = now - (24 * 60 * 60 * 1000);
        break;
      case 'week':
        cutoff = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoff = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        cutoff = 0;
    }
    
    // Filter and sort
    return entries
      .filter(entry => entry.timestamp >= cutoff)
      .sort((a, b) => b.timestamp - a.timestamp);
      
  } catch (error) {
    console.error('[H3 Aspis] Error getting filtered history:', error);
    return [];
  }
}

/**
 * Clear local history
 * @returns {Promise<boolean>}
 */
export async function clearLocalHistory() {
  try {
    await chrome.storage.local.set({ scanHistory: {} });
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error clearing history:', error);
    return false;
  }
}

/**
 * Clean up old history entries based on retention period
 * @returns {Promise<boolean>}
 */
export async function cleanupOldHistory() {
  try {
    const period = await getRetentionPeriod();
    
    if (period === 'never') {
      return true; // No cleanup needed
    }
    
    const history = await getLocalHistory();
    const now = Date.now();
    
    // Calculate cutoff based on period
    let cutoff = 0;
    switch (period) {
      case '1week':
        cutoff = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case '1month':
        cutoff = now - (30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        cutoff = now - (90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        cutoff = now - (365 * 24 * 60 * 60 * 1000);
        break;
    }
    
    // Filter out old entries
    const cleanedHistory = {};
    Object.entries(history).forEach(([address, entry]) => {
      if (entry.timestamp >= cutoff) {
        cleanedHistory[address] = entry;
      }
    });
    
    await chrome.storage.local.set({ scanHistory: cleanedHistory });
    
    console.log('[H3 Aspis] Cleaned up old history');
    return true;
    
  } catch (error) {
    console.error('[H3 Aspis] Error cleaning up history:', error);
    return false;
  }
}

/**
 * Sync history to cloud (Firebase)
 */
async function syncHistoryToCloud() {
  // TODO: Implement Firebase sync
  console.log('[H3 Aspis] Cloud history sync not yet implemented');
}

/**
 * Get retention period in human-readable format
 * @param {string} period
 * @returns {string}
 */
export function getRetentionLabel(period) {
  const labels = {
    '1week': '1 Week',
    '1month': '1 Month',
    '3months': '3 Months',
    '1year': '1 Year',
    'never': 'Never (Keep Forever)'
  };
  return labels[period] || 'Never';
}

// Run cleanup on load
cleanupOldHistory();

console.log('[H3 Aspis] Audit trail handler loaded');

