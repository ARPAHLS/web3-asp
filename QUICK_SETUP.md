# 🚀 Web3 ASP (H3 Aspis) - Quick Setup Guide

Get Web3 ASP running in under 5 minutes with zero API keys!

---

## ⚡ Minimal Setup (No API Keys Required)

Works 100% offline!

### Step 1: Copy Config File

```bash
# Copy the configuration template
cp config.example.js config.js
```

**That's all you need!** No other files required.

### Step 2: Configure config.js

Open `config.js` and verify these settings:

```javascript
features: {
  enableSanctionsCheck: true,   // ✅ Local database
  enableGoPlus: true,            // ✅ Free API, no key needed
  enableOnDeviceAI: true,        // ✅ Chrome Gemini Nano
  enableHistory: true,           // ✅ Local history storage
  demoMode: true                 // ✅ All features unlocked
}
```

**That's it!** All default RPCs are free public endpoints.

### Step 3: Load Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `Web3-ASP` folder
5. Pin the extension to your toolbar

### Step 4: Enable Chrome AI (Optional but Recommended)

For AI-powered summaries:

1. Go to `chrome://flags/#optimization-guide-on-device-model`
2. Set to **"Enabled BypassPerfRequirement"**
3. Go to `chrome://flags/#prompt-api-for-gemini-nano`
4. Set to **"Enabled"**
5. Restart Chrome

**Note**: Chrome AI requires Chrome Canary/Dev channel (version 127+)

---

## ✅ Test Your Setup

### Quick Test

1. Visit https://etherscan.io/
2. The extension should automatically highlight addresses
3. Hover over highlighted addresses to see security info
4. Click the extension icon to see the dashboard

### Test Addresses

Try these in the manual scan tool (Scan tab):

```
Blue (Safe Wallet): 0xd8da6bf26964af9d7eed9e03e53415d37aa96045 (Vitalik)
Green (Safe Contract): 0xdac17f958d2ee523a2206206994597c13d831ec7 (USDT)
Red (Sanctioned): 0x910cbd523d972eb0a6f4cae4618ad62622b39dbf (Tornado Cash)
```

### Explore Features

- **Page Tab**: See all addresses detected on current page
- **History Tab**: Browse past scans with time filters (all, today, week, month)
- **Filter Pills**: Click "Threats", "Safe", "Info" to filter by status
- **Addressbook Tab**: Save trusted addresses with custom tags

---

## 🎯 What You Get (Zero Config)

- ✅ **Real-time address scanning** on any website
- ✅ **GoPlus security analysis** (free API, no key needed)
- ✅ **Local sanctions database** (36 verified on Ethereum Mainnet, thousands across other chains)
- ✅ **Color-coded risk indicators** (green/yellow/red/blue/purple)
  - 🟢 Green = Safe verified contracts
  - 🔵 Blue = Standard wallets
  - 🟡 Yellow = Warnings/suspicious
  - 🔴 Red = Dangerous/sanctioned
  - 🟣 Purple = Your addressbook entries
- ✅ **Filter pills** for quick sorting by threat level
- ✅ **Address book** for trusted addresses with custom tags (stored locally)
- ✅ **Scan history** with time filters (all, today, week, month)
- ✅ **Chrome AI summaries** (if flags enabled)

All without a single API key! 🎉

---

## 🔧 Enhanced Setup (Optional)

Want more features? Add API keys for better performance:

### Option 1: Add Explorer API Keys

Get free keys from:
- **Etherscan**: https://etherscan.io/apis
- **Basescan**: https://basescan.org/apis
- **Polygonscan**: https://polygonscan.com/apis

Add to `config.js`:

```javascript
explorers: {
  etherscan: "YOUR_ETHERSCAN_KEY",
  basescan: "YOUR_BASESCAN_KEY",
  polygonscan: "YOUR_POLYGONSCAN_KEY"
}
```

**Benefits**: Higher rate limits, contract source code access

### Option 2: Use Private RPCs

For production/heavy usage, consider:
- **Alchemy**: https://www.alchemy.com/ (free tier)
- **Infura**: https://www.infura.io/ (free tier)
- **QuickNode**: https://www.quicknode.com/ (free tier)

Update `config.js`:

```javascript
rpc: {
  ethereum: "https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY",
  base: "https://base-mainnet.g.alchemy.com/v2/YOUR_KEY",
  polygon: "https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY"
}
```

**Benefits**: Better reliability, higher rate limits, no throttling

---

## 🛡️ Privacy & Security

### What Web3 ASP Does

- ✅ Runs AI **entirely on your device** (Gemini Nano)
- ✅ Checks sanctions **locally** (no external calls)
- ✅ Only sends addresses to GoPlus API for threat intelligence (no personal data)
- ✅ Stores addressbook and history **locally only**
- ✅ Export/import via JSON files for backup

### What Web3 ASP Does NOT Do

- ❌ Track your browsing history
- ❌ Require accounts or logins
- ❌ Use cloud storage or sync
- ❌ Collect personal information
- ❌ Use cookies or third-party trackers
- ❌ Access your wallet or private keys

---

## 🐛 Troubleshooting

### Extension doesn't load
- Check Chrome version (127+ for AI features)
- Verify you're in Developer mode
- Check browser console for errors

### No addresses detected
- Try refreshing the page
- Check if content script injected (open DevTools on page)
- Verify extension is enabled

### AI not working
- Check Chrome AI flags are enabled
- Verify you're on Chrome Canary/Dev channel
- AI will download in background (check `chrome://components/`)

### GoPlus API not working
- Check internet connection (API needs network access)
- Verify `enableGoPlus: true` in config
- Check browser console for API errors

---

## 📊 Performance Tips

### For Best Performance

1. **Use caching**: Leave `enableCaching: true` in config
2. **Limit history**: Set retention to 30-90 days
3. **Clear cache**: Periodically clear old cached analyses
4. **Use private RPCs**: Free public RPCs may throttle heavy usage

### For Maximum Privacy

1. **Local-only mode**: Everything already stored locally
2. **Use public RPCs**: No account/tracking required
3. **Clear history**: Set short retention periods
4. **Export data**: Backup via JSON files when needed

---

## 🎓 Next Steps

### Learn More

- Read **README.md** for full documentation
- Check **HACKATHON_STORY.md** for our journey and vision
- See **ENV_TEMPLATE.md** for configuration reference
- Visit **[github.com/arpahls/web3-asp](https://github.com/arpahls/web3-asp)** for latest updates

### Customize

- Add custom sanctions lists to `/data`
- Modify risk thresholds in `utils/analyzer.js`
- Customize UI colors in `popup.css` and `styles.css`
- Adjust filter options in `popup.js`

### Contribute

- Report issues at **[github.com/arpahls/web3-asp/issues](https://github.com/arpahls/web3-asp/issues)**
- Submit pull requests
- Share feedback and suggestions
- Help expand the sanctions database

---

## 💡 Pro Tips

1. **No accounts needed** - Everything works locally, no sign-ups!
2. **Public RPCs** work great for testing, but consider private RPCs for production
3. **Chrome AI** is optional but adds amazing context to security findings
4. **Sanctions database** is updated regularly - pull latest from **[github.com/arpahls/web3-asp](https://github.com/arpahls/web3-asp)**
5. **Filter pills** make it easy to find threats quickly - click multiple to combine filters
6. **Addressbook tags** persist even when auto-scan is enabled
7. **Export/Import** - Use JSON backup for your addressbook and settings

---

## 🔗 Useful Links

- **GitHub**: https://github.com/arpahls/web3-asp
- **Issues**: https://github.com/arpahls/web3-asp/issues
- **GoPlus API Docs**: https://docs.gopluslabs.io/
- **Chrome Built-in AI**: https://developer.chrome.com/docs/ai/built-in
- **Free RPC Providers**: https://chainlist.org/
- **Etherscan API**: https://docs.etherscan.io/

---

**Ready to go? Load the extension and start scanning!** 🛡️

Questions? Check the main **[README.md](README.md)** or open an issue at **[github.com/arpahls/web3-asp/issues](https://github.com/arpahls/web3-asp/issues)**.