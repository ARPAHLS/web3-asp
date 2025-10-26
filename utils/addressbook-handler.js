// H3 Aspis - Addressbook Handler
// User's personal contact list for Web3 addresses

/**
 * Get all addressbook entries
 * @returns {Promise<Object>}
 */
export async function getAddressbook() {
  try {
    const result = await chrome.storage.local.get(['addressbook']);
    return result.addressbook || {};
  } catch (error) {
    console.error('[H3 Aspis] Error getting addressbook:', error);
    return {};
  }
}

/**
 * Add entry to addressbook
 * @param {string} address - Address to add
 * @param {string} tag - User-friendly tag
 * @returns {Promise<boolean>}
 */
export async function addToAddressbook(address, tag) {
  try {
    const addressbook = await getAddressbook();
    addressbook[address.toLowerCase()] = {
      tag,
      address: address.toLowerCase(),
      dateAdded: Date.now()
    };
    
    await chrome.storage.local.set({ addressbook });
    
    // Notify content scripts to reload
    notifyContentScripts();
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error adding to addressbook:', error);
    return false;
  }
}

/**
 * Remove entry from addressbook
 * @param {string} address
 * @returns {Promise<boolean>}
 */
export async function removeFromAddressbook(address) {
  try {
    const addressbook = await getAddressbook();
    delete addressbook[address.toLowerCase()];
    
    await chrome.storage.local.set({ addressbook });
    
    // Notify content scripts to reload
    notifyContentScripts();
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error removing from addressbook:', error);
    return false;
  }
}

/**
 * Update tag for existing entry
 * @param {string} address
 * @param {string} newTag
 * @returns {Promise<boolean>}
 */
export async function updateAddressbookTag(address, newTag) {
  try {
    const addressbook = await getAddressbook();
    
    if (addressbook[address.toLowerCase()]) {
      addressbook[address.toLowerCase()].tag = newTag;
      await chrome.storage.local.set({ addressbook });
      
      // Notify content scripts to reload
      notifyContentScripts();
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[H3 Aspis] Error updating addressbook:', error);
    return false;
  }
}

/**
 * Check if address is in addressbook
 * @param {string} address
 * @returns {Promise<Object|null>}
 */
export async function getAddressbookEntry(address) {
  try {
    const addressbook = await getAddressbook();
    return addressbook[address.toLowerCase()] || null;
  } catch (error) {
    console.error('[H3 Aspis] Error getting addressbook entry:', error);
    return null;
  }
}

/**
 * Get addressbook sync setting
 * @returns {Promise<string>} 'cloud' | 'local'
 */
export async function getAddressbookSyncSetting() {
  try {
    const result = await chrome.storage.local.get(['addressbookSync']);
    return result.addressbookSync || 'local';
  } catch (error) {
    return 'local';
  }
}

/**
 * Set addressbook sync setting
 * @param {string} setting - 'cloud' | 'local'
 * @returns {Promise<boolean>}
 */
export async function setAddressbookSyncSetting(setting) {
  try {
    await chrome.storage.local.set({ addressbookSync: setting });
    
    if (setting === 'cloud') {
      // TODO: Sync to Firebase
      await syncAddressbookToCloud();
    }
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error setting addressbook sync:', error);
    return false;
  }
}

/**
 * Get security check setting for addressbook
 * @returns {Promise<boolean>}
 */
export async function getAddressbookSecurityCheck() {
  try {
    const result = await chrome.storage.local.get(['addressbookSecurityCheck']);
    return result.addressbookSecurityCheck || false;
  } catch (error) {
    return false;
  }
}

/**
 * Set security check setting for addressbook
 * @param {boolean} enabled
 * @returns {Promise<boolean>}
 */
export async function setAddressbookSecurityCheck(enabled) {
  try {
    await chrome.storage.local.set({ addressbookSecurityCheck: enabled });
    
    // Notify content scripts to rescan
    notifyContentScripts();
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error setting security check:', error);
    return false;
  }
}

/**
 * Sync addressbook to cloud (Firebase)
 */
async function syncAddressbookToCloud() {
  // TODO: Implement Firebase sync
  console.log('[H3 Aspis] Cloud sync not yet implemented');
}

/**
 * Notify all content scripts to reload addressbook
 */
function notifyContentScripts() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { type: 'RELOAD_ADDRESSBOOK' }).catch(() => {
        // Tab might not have content script, ignore error
      });
    });
  });
}

/**
 * Export addressbook as JSON
 * @returns {Promise<string>}
 */
export async function exportAddressbook() {
  try {
    const addressbook = await getAddressbook();
    return JSON.stringify(addressbook, null, 2);
  } catch (error) {
    console.error('[H3 Aspis] Error exporting addressbook:', error);
    return '{}';
  }
}

/**
 * Import addressbook from JSON
 * @param {string} jsonString
 * @returns {Promise<boolean>}
 */
export async function importAddressbook(jsonString) {
  try {
    const importedData = JSON.parse(jsonString);
    const addressbook = await getAddressbook();
    
    // Merge with existing
    Object.assign(addressbook, importedData);
    
    await chrome.storage.local.set({ addressbook });
    
    // Notify content scripts
    notifyContentScripts();
    
    return true;
  } catch (error) {
    console.error('[H3 Aspis] Error importing addressbook:', error);
    return false;
  }
}

console.log('[H3 Aspis] Addressbook handler loaded');

