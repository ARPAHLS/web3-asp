# Privacy Policy for Web3 ASP (H3 Aspis)

**Effective Date:** October 30, 2025  
**Last Updated:** October 30, 2025

## Overview

Web3 ASP (Agentic Security Protocol) is a privacy-first browser extension that provides real-time security analysis for Web3 addresses (Ethereum wallets and smart contracts). We are committed to protecting your privacy and being transparent about data collection.

## What Data We Collect

### 1. **Local Storage Data Only**
All data is stored locally on your device:
- **Addressbook Entries:** Wallet addresses you save with custom tags/labels
- **Scan History:** Previous security analysis results for reference
- **User Settings:** Your preferences (auto-scan toggle, retention period, etc.)

**This data never leaves your device. No cloud storage, no accounts, no sync.**

### 2. **Page Content Scanning**
- We scan the text content of webpages to detect blockchain addresses (0x...)
- **We do NOT store, transmit, or track:**
  - Your browsing history
  - URLs you visit
  - Page content
  - Personal information from websites

Address detection happens **locally in your browser** and is never sent to our servers.

## How We Use Data

### Data Usage Purpose:
- **Addressbook:** To help you identify and tag known wallet addresses
- **Scan History:** To provide you with a record of previously analyzed addresses
- **Settings:** To remember your preferences
- **Export/Import:** To backup and restore your data via JSON files

### Security Analysis API Calls:
When analyzing addresses, we make HTTPS requests to:
- **Blockchain RPC nodes** (public, free) - to check if address is wallet or contract
- **Etherscan/Basescan/Polygonscan APIs** - to fetch contract verification status
- **GoPlus Security API** (public, free) - to analyze token security

These APIs only receive the blockchain address being analyzed, never your personal data or browsing history.

## Data Sharing

### We DO NOT:
- ❌ Sell your data to anyone
- ❌ Share your data with advertisers
- ❌ Track your browsing behavior
- ❌ Collect analytics on your activity
- ❌ Share data with third parties for marketing

### We MAY share data only when:
- ✅ Required by law (e.g., valid legal subpoena)
- ✅ To protect against fraud or security threats

## Third-Party Services

We use the following services:
1. **GoPlus Labs API** - Token security analysis (public API, anonymous)
2. **Blockchain RPC Providers** - On-chain data queries (public, anonymous)
3. **Etherscan/Basescan/Polygonscan** - Contract verification (public APIs, anonymous)

**These services only receive blockchain addresses for analysis. No personal information or browsing history is shared.**

## Data Retention

- **Local Data:** Stored on your device until you clear it via extension settings or browser data
- **Retention Policies:** You can set automatic deletion (1 week to 1 year, or never)
- **Full Control:** You decide what data to keep and for how long

## Your Rights

You have the right to:
- ✅ **Access your data** - View all stored data in extension settings
- ✅ **Delete your data** - Clear history or addressbook anytime
- ✅ **Export your data** - Download your addressbook as JSON
- ✅ **Import your data** - Restore from JSON backup files

### How to Manage Your Data:
1. **Clear History:** Open extension → Settings → Audit Trail → Clear All History
2. **Clear Addressbook:** Open extension → Settings → My Addressbook → Delete individual entries
3. **Export Data:** Settings → My Addressbook → Export (downloads JSON)
4. **Import Data:** Settings → My Addressbook → Import (uploads JSON)

## Security

We implement industry-standard security measures:
- All data transmission uses HTTPS encryption
- Local data stored using Chrome's secure storage API (`chrome.storage.local`)
- No passwords or authentication tokens stored
- No cloud services or external databases

## Children's Privacy

This extension is not directed to children under 13. We do not knowingly collect data from children.

## Changes to This Policy

We may update this privacy policy occasionally. Changes will be posted here with an updated "Last Updated" date. Continued use of the extension after changes constitutes acceptance.

## Open Source

This extension is open source. You can review the code at:
**GitHub:** https://github.com/arpahls/web3-asp

## Contact Us

For privacy questions or concerns:
- **GitHub Issues:** https://github.com/arpahls/web3-asp/issues
- **Email:** privacy@arpacorp.net
- **Donation Address:** https://etherscan.io/address/0x14b16Ab34fB80f7Bdfd694394600898416a1821c

**Note:** Since all data is stored locally, you have complete control and can delete it anytime without contacting us.

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)

---

**Built by ARPA Team**  
**Version:** 0.3.9  
**License:** MIT

