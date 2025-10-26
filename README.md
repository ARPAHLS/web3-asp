# H3 Aspis: Web3 Security Companion

> Privacy-first Web3 security analysis powered by on-device AI and real-time threat intelligence

**Version**: 0.3.2 | **Status**: ✅ Production Ready | **Last Updated**: October 24, 2025

H3 Aspis is a Chrome extension that provides real-time security analysis of smart contracts and wallet addresses as you browse the Web3. Using GoPlus Security API for threat detection and Google Chrome's built-in Gemini Nano AI for intelligent summaries, H3 Aspis protects your privacy while keeping you safe.

---

## 🛡️ Features

### Core Features (v0.3.2)
- **Real-Time Address Detection**: Automatically scans web pages for Ethereum addresses
- **Visual Security Indicators**: Color-coded highlighting (Green = Safe, Yellow = Warning, Red = Dangerous, Purple = Addressbook)
- **GoPlus Security API**: Real-time threat intelligence for honeypots, scams, and rug pulls
- **On-Device AI Summaries**: Uses Gemini Nano to explain security findings in plain English
- **Manual Scan Tool**: Analyze any address on-demand with detailed reports
- **Sanctions Database**: 36 verified sanctioned addresses (OFAC, FBI, Israeli NBCTF)
- **My Addressbook**: Save trusted addresses with custom tags
- **Audit Trail**: Configurable scan history with retention policies
- **Multi-Address Support**: Handle multiple addresses on a single page

### Privacy-First Design
- ✅ AI summaries run **entirely on your device** (Gemini Nano)
- ✅ Sanctions database is 100% local (no external calls)
- ✅ Only address sent to GoPlus API for threat intelligence
- ✅ Addressbook and history saved locally (optional cloud sync)
- ✅ You control retention policies (delete after 1 week to 1 year)

### Security Architecture
- **Tier 1**: GoPlus API - Behavioral threat detection (< 1 second)
- **Tier 2**: Local sanctions database - 36 verified addresses (instant)
- **Tier 3**: Gemini Nano AI - Explains findings in plain English (< 2 seconds)
- **Total**: < 3 seconds for complete analysis ⚡

### Demo Mode
- ✅ All features are **free and publicly available** for testing
- ✅ No tier gating or paywalls
- 🚧 Stripe integration (placeholder for future Pro tier)

---

## 📦 Installation

### Prerequisites
- Chrome browser (version 127+, Canary/Dev channel recommended)
- Chrome Built-in AI Early Preview access (for Gemini Nano)
- Node.js (optional, for dataset import)

### Quick Start

1. **Clone or Download** this repository

2. **Prepare Icons** (Optional)
   ```bash
   # Add your icon files to /icons/ directory
   # See icons/ICONS_README.md for specifications
   ```

3. **Configure the Extension**
   ```bash
   # Copy configuration templates
   cp config.example.js config.js
   cp firebase-config.example.js firebase-config.js
   
   # Edit config.js with your API keys (optional for basic functionality)
   ```

4. **Import Datasets** (Optional)
   ```bash
   # If you have ARPA Wallet Screening datasets
   node scripts/import-datasets.js
   ```

5. **Load Extension in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `H3_Aspis_Chrome_Extension` folder
   - Pin the extension to your toolbar

6. **Enable Chrome AI**
   - Navigate to `chrome://flags/#optimization-guide-on-device-model`
   - Set to "Enabled BypassPerfRequirement"
   - Navigate to `chrome://flags/#prompt-api-for-gemini-nano`
   - Set to "Enabled"
   - Restart Chrome

---

## 🚀 Usage

### Automatic Scanning
1. Visit any Web3 site (e.g., Etherscan, Uniswap, OpenSea)
2. H3 Aspis automatically detects and highlights addresses
3. Hover over highlighted addresses for quick risk info
4. Click a highlighted address to see full analysis

### Manual Scanning
1. Click the H3 Aspis icon in your toolbar
2. Go to the "Scan" tab
3. Paste any Ethereum/Base/Polygon address
4. Click "Analyze" to see detailed security report

### Understanding Risk Colors
- 🟢 **Green**: Safe - Verified contract or established wallet
- 🔵 **Blue**: Info - Standard wallet or informational
- 🟡 **Yellow**: Warning - Suspicious activity or medium risk
- 🔴 **Red**: Danger - Known scam, honeypot, or sanctioned entity
- 🟣 **Purple**: Addressbook - Your saved trusted address with custom tag

---

## ⚙️ Configuration

### RPC Endpoints
Edit `config.js` to add your RPC provider URLs:

```javascript
rpc: {
  ethereum: "https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
  base: "https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY",
  polygon: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
}
```

**Recommended Providers:**
- [Alchemy](https://www.alchemy.com/) - Free tier available
- [Infura](https://infura.io/)
- [QuickNode](https://www.quicknode.com/)

### Firebase (Optional)
For cloud history and authentication:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication (Google provider)
3. Enable Firestore Database
4. Copy your config to `firebase-config.js`

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  // ... other config values
};
```

5. In `config.js`, set:
```javascript
features: {
  enableFirebase: true
}
```

### Blockchain Explorer APIs
For contract verification checking:

```javascript
explorers: {
  etherscan: "YOUR_ETHERSCAN_API_KEY",
  basescan: "YOUR_BASESCAN_API_KEY",
  polygonscan: "YOUR_POLYGONSCAN_API_KEY"
}
```

Get free API keys:
- [Etherscan](https://etherscan.io/apis)
- [Basescan](https://basescan.org/apis)
- [Polygonscan](https://polygonscan.com/apis)

---

## 📊 Architecture

### Component Overview

```
H3_Aspis_Chrome_Extension/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (analysis orchestrator)
├── content.js                 # Page scanner & highlighter
├── popup.html/js/css          # Dashboard UI
├── utils/
│   ├── web3-utils.js          # Blockchain helpers
│   ├── analyzer.js            # AI prompt engineering
│   └── firebase-handler.js    # Cloud sync (optional)
├── data/
│   └── sanctions-dataset.js   # Offline malicious address DB
└── scripts/
    └── import-datasets.js     # Dataset converter
```

### Data Flow

```
Page Load → Content Script Scans DOM
    ↓
Detects 0x Addresses
    ↓
Sends to Background Script
    ↓
Background Checks Sanctions List (Offline)
    ↓
Queries Blockchain RPC (eth_getCode)
    ↓
Sends to Gemini Nano (On-Device AI)
    ↓
Returns Analysis Result
    ↓
Content Script Highlights Address
```

---

## 🧪 Development

### Project Structure
```
.
├── background.js              # Main service worker
├── content.js                 # Injected into web pages
├── popup.html                 # Dashboard HTML
├── popup.js                   # Dashboard logic
├── popup.css                  # Dashboard styles (lilac theme)
├── styles.css                 # Content script styles
├── manifest.json              # Extension manifest
├── config.example.js          # Configuration template
├── firebase-config.example.js # Firebase template
├── utils/                     # Utility modules
├── data/                      # Datasets
├── scripts/                   # Build/import scripts
└── icons/                     # Extension icons
```

### Adding New Features

1. **New Analysis Rules**: Edit `utils/analyzer.js`
2. **New UI Components**: Edit `popup.html` and `popup.css`
3. **New Datasets**: Add to `data/` and update import script
4. **New Blockchains**: Update `utils/web3-utils.js` and `config.js`

### Testing

```bash
# Test on different sites
- Etherscan.io (contract verification)
- Uniswap.org (DeFi protocols)
- OpenSea.io (NFT addresses)
- Random scam sites (test red alerts)

# Test scenarios
- Manual scan
- Page auto-scan
- Address highlighting
- Tooltip display
- History logging (if Firebase enabled)
```

---

## 🛠️ Troubleshooting

### Extension doesn't load
- Check that you're in Developer mode
- Verify manifest.json has no syntax errors
- Check background script console for errors

### No addresses detected
- Ensure content script is injecting (check page console)
- Verify site is not blocking content scripts
- Try reloading the page

### AI analysis not working
- Confirm Chrome AI flags are enabled
- Check Chrome version (127+ required)
- Verify Gemini Nano is downloaded
- Check background script console for AI errors

### Icons not showing
- Add icon files to `/icons/` directory
- Ensure filenames match manifest.json
- Reload extension

### Firebase errors
- Verify firebase-config.js exists and is valid
- Check Firebase console for authentication/Firestore setup
- Ensure `enableFirebase: true` in config.js

---

## 🔒 Security & Privacy

### What H3 Aspis Does:
- ✅ Analyzes addresses **on your device**
- ✅ Stores sanctions lists **locally**
- ✅ Only sends data to Firebase if you sign in and enable history

### What H3 Aspis Does NOT Do:
- ❌ Track your browsing
- ❌ Send addresses to external servers (except Firebase, if enabled)
- ❌ Collect personal information
- ❌ Use cookies or third-party trackers

### Data Storage:
- **Local**: Analysis cache, user settings
- **Cloud** (Optional): Scan history (only if signed in and enabled)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: support@h3aspis.com

---

## 🎯 Roadmap

### v0.2.0 (Next Release)
- [ ] Multi-chain support (Arbitrum, Optimism, BSC)
- [ ] Contract source code analysis
- [ ] Transaction simulation
- [ ] Custom alerts and notifications

### v0.3.0
- [ ] NFT metadata analysis
- [ ] Token approval checking
- [ ] Phishing detection
- [ ] Browser-wide security warnings

### v1.0.0
- [ ] Pro tier with Stripe integration
- [ ] Advanced AI models
- [ ] Community reporting system
- [ ] API for developers

---

## 🙏 Acknowledgments

- Built with [Chrome Built-in AI (Gemini Nano)](https://developer.chrome.com/docs/ai/built-in)
- Powered by [ARPA Wallet Screening](https://arpa.systems) datasets
- Inspired by the Web3 security community

---

**Made with 💜 by the H3 Aspis Team**

*Protecting the Web3 ecosystem, one address at a time.*

---

## 📝 Version History

| Version | Date | Highlights |
|---------|------|------------|
| **0.3.2** | Oct 24, 2025 | Documentation cleanup, finalized security strategy |
| **0.3.1** | Oct 24, 2025 | Sanctions database rebuild (36 addresses) |
| **0.3.0** | Oct 24, 2025 | Addressbook & audit trail UI complete |
| **0.2.0** | Oct 24, 2025 | Multi-address support, sequential analysis |
| **0.1.0** | Oct 24, 2025 | Initial release with GoPlus & AI |

**See `UPDATE_NOTES.md` for complete changelog**

