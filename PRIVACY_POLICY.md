# Privacy Policy for Web3 ASP (H3 Aspis)

**Effective Date:** October 27, 2025  
**Last Updated:** October 27, 2025

## Overview

Web3 ASP (Agentic Security Protocol) is a privacy-first browser extension that provides real-time security analysis for Web3 addresses (Ethereum wallets and smart contracts). We are committed to protecting your privacy and being transparent about data collection.

## What Data We Collect

### 1. **Local Storage Data (Always Collected)**
Stored locally on your device only:
- **Addressbook Entries:** Wallet addresses you save with custom tags/labels
- **Scan History:** Previous security analysis results for reference
- **User Settings:** Your preferences (auto-scan toggle, theme, etc.)

**This data never leaves your device unless you explicitly enable cloud backup.**

### 2. **Optional Cloud Backup Data (Only if You Sign In)**
If you voluntarily create an account and sign in with Firebase:
- **Email Address:** Used for authentication and account recovery
- **Authentication Token:** Secure token to sync your data across devices
- **Addressbook Backup:** Your saved contacts (synced to Firebase)

**Signing in is completely optional. The extension works 100% without an account.**

### 3. **Page Content Scanning**
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
- **Authentication (if used):** To enable cloud backup and sync across devices

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
1. **Firebase (Google)** - Optional authentication and cloud backup
   - [Firebase Privacy Policy](https://firebase.google.com/support/privacy)
2. **GoPlus Labs API** - Token security analysis (public API, anonymous)
3. **Blockchain RPC Providers** - On-chain data queries (public, anonymous)
4. **Etherscan/Basescan/Polygonscan** - Contract verification (public APIs, anonymous)

**None of these services receive your personal information or browsing history.**

## Data Retention

- **Local Data:** Stored indefinitely on your device until you clear it via extension settings or browser data
- **Cloud Data (if signed in):** Retained until you delete your account or manually clear data
- **No automatic deletion** - you have full control

## Your Rights

You have the right to:
- ✅ **Access your data** - View all stored data in extension settings
- ✅ **Delete your data** - Clear history, addressbook, or entire account anytime
- ✅ **Export your data** - Download your addressbook as JSON
- ✅ **Opt out of cloud sync** - Use the extension entirely offline

### How to Delete Your Data:
1. **Local data:** Open extension → Settings → Clear History / Clear Addressbook
2. **Account deletion:** Contact us at privacy@arpacorp.net to delete your Firebase account

## Security

We implement industry-standard security measures:
- All data transmission uses HTTPS encryption
- Firebase authentication tokens are securely managed by Google
- Local data stored using Chrome's secure storage API
- No passwords are stored by our extension (handled by Firebase)

## Children's Privacy

This extension is not directed to children under 13. We do not knowingly collect data from children.

## Changes to This Policy

We may update this privacy policy occasionally. Changes will be posted here with an updated "Last Updated" date. Continued use of the extension after changes constitutes acceptance.

## Open Source

This extension is open source. You can review the code at:
**GitHub:** https://github.com/arpahls/web3-asp

## Contact Us

For privacy questions, data deletion requests, or concerns:
- **GitHub Issues:** https://github.com/arpahls/web3-asp/issues
- **Email:** privacy@arpacorp.net
- **Donation Address:** https://etherscan.io/address/0x14b16Ab34fB80f7Bdfd694394600898416a1821c

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)

---

**Built by ARPA Team**  
**Version:** 0.3.8  
**License:** MIT

