// H3 Aspis - Firebase Handler
// Firebase authentication and Firestore operations

// Note: This file requires firebase-config.js to be created from template
// Import Firebase (will be loaded via CDN in manifest or bundled)

let firebaseApp = null;
let auth = null;
let db = null;
let currentUser = null;

/**
 * Initialize Firebase
 * @param {Object} config - Firebase configuration
 */
export async function initializeFirebase(config) {
  try {
    // In production, import Firebase SDK
    // For now, we'll check if Firebase is available globally
    if (typeof firebase === 'undefined') {
      console.warn('[H3 Aspis] Firebase SDK not loaded');
      return false;
    }
    
    firebaseApp = firebase.initializeApp(config);
    auth = firebase.auth();
    db = firebase.firestore();
    
    // Setup auth state listener
    auth.onAuthStateChanged(handleAuthStateChange);
    
    console.log('[H3 Aspis] Firebase initialized');
    return true;
    
  } catch (error) {
    console.error('[H3 Aspis] Firebase initialization error:', error);
    return false;
  }
}

/**
 * Handle authentication state changes
 * @param {Object} user - Firebase user object
 */
function handleAuthStateChange(user) {
  currentUser = user;
  
  if (user) {
    console.log('[H3 Aspis] User signed in:', user.email);
    
    // Ensure user document exists in Firestore
    ensureUserDocument(user);
    
    // Notify background script
    chrome.runtime.sendMessage({
      type: 'AUTH_STATE_CHANGED',
      user: {
        uid: user.uid,
        email: user.email,
        isAuthenticated: true
      }
    });
  } else {
    console.log('[H3 Aspis] User signed out');
    
    chrome.runtime.sendMessage({
      type: 'AUTH_STATE_CHANGED',
      user: {
        isAuthenticated: false
      }
    });
  }
}

/**
 * Sign in with Google using Chrome Identity API
 * @returns {Promise<Object>} User object
 */
export async function signInWithGoogle() {
  try {
    // Use Chrome Identity API for OAuth
    const token = await new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
    
    // Create Firebase credential
    const credential = firebase.auth.GoogleAuthProvider.credential(null, token);
    
    // Sign in to Firebase
    const result = await auth.signInWithCredential(credential);
    
    console.log('[H3 Aspis] Sign in successful:', result.user.email);
    return result.user;
    
  } catch (error) {
    console.error('[H3 Aspis] Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out
 * @returns {Promise<void>}
 */
export async function signOut() {
  try {
    // Remove Chrome identity token
    const token = await new Promise((resolve) => {
      chrome.identity.getAuthToken({ interactive: false }, resolve);
    });
    
    if (token) {
      await new Promise((resolve) => {
        chrome.identity.removeCachedAuthToken({ token }, resolve);
      });
    }
    
    // Sign out from Firebase
    await auth.signOut();
    
    console.log('[H3 Aspis] Sign out successful');
    
  } catch (error) {
    console.error('[H3 Aspis] Sign out error:', error);
    throw error;
  }
}

/**
 * Ensure user document exists in Firestore
 * @param {Object} user - Firebase user
 */
async function ensureUserDocument(user) {
  try {
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      // Create new user document
      await userRef.set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        tier: 'free',
        settings: {
          historyEnabled: false,
          autoDeleteDays: 90,
          checkSanctions: true
        }
      });
      
      console.log('[H3 Aspis] User document created');
    } else {
      console.log('[H3 Aspis] User document exists');
    }
    
  } catch (error) {
    console.error('[H3 Aspis] Error ensuring user document:', error);
  }
}

/**
 * Get user profile from Firestore
 * @param {string} userId
 * @returns {Promise<Object>}
 */
export async function getUserProfile(userId) {
  try {
    const doc = await db.collection('users').doc(userId).get();
    
    if (doc.exists) {
      return doc.data();
    }
    
    return null;
    
  } catch (error) {
    console.error('[H3 Aspis] Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user settings
 * @param {string} userId
 * @param {Object} settings
 * @returns {Promise<boolean>}
 */
export async function updateUserSettings(userId, settings) {
  try {
    await db.collection('users').doc(userId).update({
      settings: settings
    });
    
    return true;
    
  } catch (error) {
    console.error('[H3 Aspis] Error updating settings:', error);
    return false;
  }
}

/**
 * Save analysis to history
 * @param {string} userId
 * @param {string} address
 * @param {Object} result
 * @param {string} pageUrl
 * @returns {Promise<boolean>}
 */
export async function saveToHistory(userId, address, result, pageUrl = null) {
  try {
    const historyRef = db.collection('users').doc(userId).collection('history').doc(address);
    
    const existing = await historyRef.get();
    
    if (existing.exists) {
      // Update existing entry
      await historyRef.update({
        lastScanned: firebase.firestore.FieldValue.serverTimestamp(),
        scanCount: firebase.firestore.Increment(1),
        ...result,
        pageUrl
      });
    } else {
      // Create new entry
      await historyRef.set({
        address,
        ...result,
        firstScanned: firebase.firestore.FieldValue.serverTimestamp(),
        lastScanned: firebase.firestore.FieldValue.serverTimestamp(),
        scanCount: 1,
        pageUrl
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('[H3 Aspis] Error saving to history:', error);
    return false;
  }
}

/**
 * Get user history
 * @param {string} userId
 * @param {Object} filters - Time filters
 * @returns {Promise<Array>}
 */
export async function getHistory(userId, filters = {}) {
  try {
    let query = db.collection('users').doc(userId).collection('history')
      .orderBy('lastScanned', 'desc');
    
    // Apply time filter
    if (filters.timeRange) {
      const now = new Date();
      let startDate;
      
      switch (filters.timeRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        query = query.where('lastScanned', '>=', startDate);
      }
    }
    
    // Limit results
    query = query.limit(100);
    
    const snapshot = await query.get();
    
    const history = [];
    snapshot.forEach(doc => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return history;
    
  } catch (error) {
    console.error('[H3 Aspis] Error getting history:', error);
    return [];
  }
}

/**
 * Clear user history
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
export async function clearHistory(userId) {
  try {
    const batch = db.batch();
    const snapshot = await db.collection('users').doc(userId).collection('history').get();
    
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log('[H3 Aspis] History cleared');
    return true;
    
  } catch (error) {
    console.error('[H3 Aspis] Error clearing history:', error);
    return false;
  }
}

/**
 * Get current user
 * @returns {Object|null}
 */
export function getCurrentUser() {
  return currentUser;
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return currentUser !== null;
}

