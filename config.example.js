// H3 Aspis Configuration Template
// Copy this file to 'config.js' and fill in your actual values
// NEVER commit config.js to git!
//
// For environment variable reference, see ENV_TEMPLATE.md

const CONFIG = {
  // ============================================================================
  // RPC ENDPOINTS - Free Public RPCs (No API Keys Required!)
  // ============================================================================
  // These are production-ready public RPCs that work out of the box
  // For higher rate limits, consider: Alchemy, Infura, QuickNode
  
  rpc: {
    ethereum: "https://cloudflare-eth.com",
    // Alternative: "https://rpc.ankr.com/eth"
    
    base: "https://mainnet.base.org",
    // Alternative: "https://base.llamarpc.com"
    
    polygon: "https://polygon-rpc.com"
    // Alternative: "https://rpc.ankr.com/polygon"
  },
  
  // ============================================================================
  // CHAIN CONFIGURATION
  // ============================================================================
  // Chain IDs and explorer URLs
  
  chains: {
    ethereum: {
      id: 1,
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      explorerUrl: 'https://etherscan.io',
      explorerApi: 'https://api.etherscan.io/api'
    },
    base: {
      id: 8453,
      name: 'Base',
      symbol: 'ETH',
      decimals: 18,
      explorerUrl: 'https://basescan.org',
      explorerApi: 'https://api.basescan.org/api'
    },
    polygon: {
      id: 137,
      name: 'Polygon',
      symbol: 'MATIC',
      decimals: 18,
      explorerUrl: 'https://polygonscan.com',
      explorerApi: 'https://api.polygonscan.com/api'
    }
  },
  
  // ============================================================================
  // BLOCKCHAIN EXPLORER API KEYS (Optional)
  // ============================================================================
  // Get free keys from:
  // - Etherscan: https://etherscan.io/apis
  // - Basescan: https://basescan.org/apis
  // - Polygonscan: https://polygonscan.com/apis
  // Benefits: Higher rate limits, contract source code access
  
  explorers: {
    etherscan: "",  // Leave empty for basic access
    basescan: "",   // Leave empty for basic access
    polygonscan: "" // Leave empty for basic access
  },
  
  // ============================================================================
  // GOPLUS SECURITY API (Free - No API Key Required!)
  // ============================================================================
  // GoPlus provides free Web3 security analysis
  // Documentation: https://docs.gopluslabs.io/
  
  security: {
    goplus: {
      baseUrl: "https://api.gopluslabs.io/api/v1",
      enabled: true,
      timeout: 10000  // 10 seconds
    }
  },
  
  // ============================================================================
  // FEATURE FLAGS
  // ============================================================================
  
  features: {
    // Core Features (all work without any API keys!)
    enableSanctionsCheck: true,   // Local database, instant
    enableGoPlus: true,            // Free API, no key needed
    enableOnDeviceAI: true,        // Chrome Gemini Nano
    enableAutoScan: true,          // Scan pages automatically
    enableHistory: true,           // Local history storage
    
    // Optional Features
    enableFirebase: false,         // Set to true if you configured Firebase
    enableNotifications: true,     // Browser notifications
    
    // Demo Mode (recommended for hackathons/testing)
    demoMode: true                 // All features unlocked, no paywalls
  },
  
  // ============================================================================
  // CACHE SETTINGS
  // ============================================================================
  
  cache: {
    ttl: 3600000,      // 1 hour in milliseconds
    maxSize: 1000,     // Maximum cached addresses
    enableCaching: true
  },
  
  // ============================================================================
  // DEFAULT USER SETTINGS
  // ============================================================================
  
  defaults: {
    historyRetentionDays: 90,    // Keep history for 90 days
    autoScanEnabled: true,       // Auto-scan pages on load
    notificationsEnabled: true,  // Show notifications for threats
    theme: 'lilac'               // UI theme
  },
  
  // ============================================================================
  // STRIPE CONFIGURATION (Optional - For Future Premium Features)
  // ============================================================================
  // Only needed if you want to implement paid tiers
  
  stripe: {
    publishableKey: "",  // Leave empty for free/demo mode
    priceId: ""          // Leave empty for free/demo mode
  },
  
  // ============================================================================
  // FIREBASE CONFIGURATION (Optional - For Cloud Sync)
  // ============================================================================
  // Only needed if you want cloud history sync and cross-device settings
  // If enableFirebase is false above, this is ignored
  // Configure in firebase-config.js instead
  
  firebase: {
    // See firebase-config.example.js for setup instructions
    configured: false  // Set to true after configuring firebase-config.js
  }
};

// ============================================================================
// VALIDATION & EXPORT
// ============================================================================

// Validate configuration on load
if (typeof window !== 'undefined') {
  console.log('[H3 Aspis Config] Loaded configuration');
  console.log('[H3 Aspis Config] Demo Mode:', CONFIG.features.demoMode);
  console.log('[H3 Aspis Config] GoPlus Enabled:', CONFIG.features.enableGoPlus);
  console.log('[H3 Aspis Config] Firebase Enabled:', CONFIG.features.enableFirebase);
  console.log('[H3 Aspis Config] AI Enabled:', CONFIG.features.enableOnDeviceAI);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

// Make available globally in extension context
if (typeof window !== 'undefined') {
  window.H3_ASPIS_CONFIG = CONFIG;
}

