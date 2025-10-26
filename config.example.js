// H3 Aspis Configuration Template
// Copy this file to 'config.js' and fill in your actual values
// NEVER commit config.js to git!

const CONFIG = {
  // Firebase Configuration
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
  },
  
  // RPC Endpoints (for blockchain data) - Using public RPCs
  rpc: {
    ethereum: "https://cloudflare-eth.com",
    base: "https://mainnet.base.org",
    polygon: "https://polygon-rpc.com"
  },
  
  // Blockchain Explorer API Keys (optional for enhanced features)
  explorers: {
    etherscan: "",  // Optional: add your key for rate limit increases
    basescan: "",
    polygonscan: ""
  },
  
  // GoPlus Security API (free, no key required)
  security: {
    goplus: {
      baseUrl: "https://api.gopluslabs.io/api/v1",
      enabled: true
    }
  },
  
  // Feature Flags
  features: {
    enableHistory: true,
    enableFirebase: true,
    enableSanctionsCheck: true,
    enableOnDeviceAI: true,
    demoMode: true  // Set to true for hackathon/demo (no gating)
  },
  
  // Stripe Configuration (for future premium features)
  stripe: {
    publishableKey: "pk_test_YOUR_STRIPE_KEY",
    priceId: "price_YOUR_PRICE_ID"
  },
  
  // Default Settings
  defaults: {
    historyRetentionDays: 90,
    autoScanEnabled: true,
    notificationsEnabled: true
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

