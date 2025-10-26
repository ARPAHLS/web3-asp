# H3 Aspis Environment Configuration Template

This template shows the environment variables used in the Web3 Agent and how to configure similar settings in the Chrome extension.

## 🔧 Configuration Approach

Since Chrome extensions cannot directly use `.env` files, we use `config.js` instead. Copy `config.example.js` to `config.js` and fill in the values below.

---

## 📝 Environment Variables Reference

### RPC Endpoints (Free Public RPCs - No API Key Required)

```bash
# Ethereum Mainnet
ETHEREUM_RPC_URL=https://cloudflare-eth.com
# Alternative: https://rpc.ankr.com/eth

# Base (Coinbase L2)
BASE_RPC_URL=https://mainnet.base.org  
# Alternative: https://base.llamarpc.com

# Polygon
POLYGON_RPC_URL=https://polygon-rpc.com
# Alternative: https://rpc.ankr.com/polygon
```

### Blockchain Explorer API Keys (Optional)

Get free API keys from:
- **Etherscan**: https://etherscan.io/apis
- **Basescan**: https://basescan.org/apis  
- **Polygonscan**: https://polygonscan.com/apis

```bash
ETHERSCAN_API_KEY=your_key_here
BASESCAN_API_KEY=your_key_here
POLYGONSCAN_API_KEY=your_key_here
```

### GoPlus Security API (Free - No Key Required)

```bash
GOPLUS_API_ENABLED=true
GOPLUS_API_BASE_URL=https://api.gopluslabs.io/api/v1
```

GoPlus provides free Web3 security analysis with no API key required!
- **Documentation**: https://docs.gopluslabs.io/
- **Features**: Honeypot detection, scam analysis, token security audits

### Firebase Configuration (Optional - For Cloud Sync)

Required only if you want cloud features (history sync, authentication):

```bash
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef

ENABLE_FIREBASE=false  # Set to true to enable
```

### Feature Flags

```bash
ENABLE_CHROME_AI=true
ENABLE_SANCTIONS_CHECK=true
ENABLE_GOPLUS_SECURITY=true
ENABLE_AUTO_SCAN=true
ENABLE_HISTORY=true
DEMO_MODE=true  # All features unlocked for testing
```

### Default Settings

```bash
HISTORY_RETENTION_DAYS=90
CACHE_TTL_HOURS=1
MAX_CACHE_SIZE=1000
```

---

## 🚀 Quick Setup

### Minimal Setup (No API Keys Required)

1. Copy `config.example.js` to `config.js`
2. Leave all RPC URLs as default (free public RPCs)
3. Set `enableFirebase: false`
4. Set `demoMode: true`
5. Load extension in Chrome

This gives you:
- ✅ Real-time address scanning
- ✅ GoPlus security analysis
- ✅ Local sanctions database
- ✅ Chrome AI summaries (if enabled in Chrome flags)
- ✅ Address book (stored locally)
- ✅ Scan history (stored locally)

### Enhanced Setup (With API Keys)

1. Get free API keys from Etherscan, Basescan, Polygonscan
2. Add them to `config.js` under `explorers`
3. Benefits:
   - Higher rate limits
   - Contract verification details
   - Source code access

### Full Setup (With Firebase)

1. Create Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Firestore
3. Copy Firebase config to `firebase-config.js`
4. Set `enableFirebase: true` in `config.js`
5. Benefits:
   - Cloud history sync
   - Cross-device settings
   - User authentication

---

## 📊 Comparison: Web3 Agent vs Chrome Extension

| Feature | Web3 Agent (Python) | Chrome Extension |
|---------|---------------------|------------------|
| Config Method | `.env` file | `config.js` file |
| RPC Access | Direct via web3.py | Direct via fetch API |
| GoPlus SDK | `goplus-sdk-py` | REST API calls |
| AI | Google Gemini API | Chrome Gemini Nano (on-device) |
| Storage | PostgreSQL | Chrome Storage + Optional Firebase |
| Authentication | N/A | Optional Google OAuth via Firebase |

---

## 🛡️ Security Best Practices

1. **Never commit sensitive keys**
   - Add `config.js` to `.gitignore`
   - Add `firebase-config.js` to `.gitignore`

2. **Use public RPCs for testing**
   - Free and no registration required
   - Perfect for hackathons and demos

3. **Use private RPCs for production**
   - Consider Alchemy or Infura
   - Better rate limits and reliability

4. **Firebase is optional**
   - Extension works 100% offline without Firebase
   - Only needed for cloud sync features

---

## 🔗 Useful Links

- **GoPlus API Docs**: https://docs.gopluslabs.io/
- **Chrome Built-in AI**: https://developer.chrome.com/docs/ai/built-in
- **Web3 RPC Providers**: 
  - https://chainlist.org/ (find free RPCs)
  - https://www.alchemy.com/ (free tier)
  - https://www.infura.io/ (free tier)

---

## 💡 Tips

- **Demo Mode**: Perfect for hackathons and testing. All features work without any API keys!
- **Public RPCs**: Reliable enough for demos, but may have rate limits for heavy usage
- **Chrome AI**: Requires Chrome Canary/Dev channel with flags enabled
- **Sanctions Database**: 100% local, no external calls, instant results

---

**Ready to go?** Copy `config.example.js` to `config.js` and start scanning! 🛡️

