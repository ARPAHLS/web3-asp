# Web3 ASP: Web3 Agentic Security Protocol
> **Protecting the Web3 ecosystem, one address at a time** 🛡️

---

## Inspiration

The Web3 world is exciting, but it's also dangerous. Every day, newcomers lose millions to scam contracts, honeypot tokens, and phishing attacks. We watched friends get burned by malicious smart contracts that looked legitimate. We saw grandparents clicking on fake NFT links. We witnessed experienced developers falling for sophisticated rug pulls.

The problem? **Security tools are either too complex for beginners or too slow for everyone else.**

That's when we had our "aha" moment. We had already built **[Hermes3](https://github.com/arpahls/hermes3)**, a powerful Web3 AI Agent that helps users navigate blockchain complexity. But Hermes3 was a full application—overkill when someone just wants to quickly check if a contract address on Twitter is safe.

**What if we could bring Hermes3's intelligence into the browser itself?**

We envisioned a lightweight security guardian that works *as you browse*—highlighting risky addresses in real-time, explaining threats in plain English, and doing it all **without compromising your privacy**. No complex dashboards. No uploading wallet data to servers. Just instant protection, right where you need it.

That vision became **H3 Aspis**, or Web3 ASP (named after the Greek shield, because we're protecting Web3 warriors).

---

## What it does

Web3 ASP is a Chrome extension that acts as your personal Web3 security analyst, watching your back as you explore the blockchain ecosystem.

### 🎯 Core Capabilities

**1. Real-Time Address Detection**
- Automatically scans every webpage you visit for Ethereum, Base, and Polygon addresses
- Works on Etherscan, Uniswap, OpenSea, Twitter, Discord, Articles you read online—anywhere addresses appear
- Detects addresses in text, links, code blocks, and dynamic content

**2. Instant Visual Alerts**
- 🟢 **Green**: Safe—verified contracts or established wallets
- 🔵 **Blue**: Info—standard wallets, no red flags
- 🟡 **Yellow**: Warning—suspicious patterns or medium risk
- 🔴 **Red**: Danger—confirmed scams, honeypots, or sanctioned entities
- 🟣 **Purple**: Your saved trusted addresses from "My Addressbook"

**3. Intelligent Security Analysis**
Web3 ASP runs a **3-tier security check** in under 3 seconds:

- **Tier 1: Local Sanctions Database** (instant)
  - 36 verified malicious addresses on Ethereum Mainnet from OFAC, FBI, Israeli NBCTF
  - Thousands more across other EVM chains and Bitcoin
  - Lazarus Group wallets, Tornado Cash sanctions, crypto terrorism financing
  - Zero external calls = zero latency

- **Tier 2: GoPlus Security API** (< 1 second)
  - Real-time threat intelligence for honeypot detection
  - Scam pattern recognition and rug pull indicators
  - Behavioral analysis across millions of contracts

- **Tier 3: On-Device AI Analysis** (< 2 seconds)
  - Google Chrome's built-in **Gemini Nano AI** explains findings in plain English
  - Runs **entirely on your device**—no data leaves your browser
  - Contextual summaries: "This is a simple wallet with normal activity" vs "This contract has honeypot characteristics—you can send tokens in but cannot withdraw"

**4. Manual Scan Tool**
- Paste any address for instant deep analysis
- See balance, transaction count, contract verification status
- Get actionable recommendations before interacting

**5. Privacy-First Features**
- **My Addressbook**: Save trusted addresses with custom tags (friends, exchanges, DAOs)
- **Audit Trail**: Review your scan history with configurable retention (1 week to 1 year)
- **Local-First Storage**: Everything stored on your device unless you opt into cloud sync

---

## How we built it

### 🏗️ Architecture

Web3 ASP is built as a **Manifest V3 Chrome Extension** with a sophisticated multi-layer architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Web Page Layer                        │
│  (Etherscan, Uniswap, Twitter, any site with addresses) │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│              Content Script (content.js)                 │
│  • Scans DOM for 0x addresses using regex               │
│  • Injects color-coded highlights around addresses      │
│  • Displays hover tooltips with risk summaries          │
│  • Observes DOM mutations for dynamic content           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Background Service Worker (background.js)        │
│  • Central analysis orchestrator                        │
│  • Manages analysis queue and caching                   │
│  • Coordinates security checks across all tiers         │
└──────┬────────┬────────┬──────────────┬─────────────────┘
       │        │        │              │
       ▼        ▼        ▼              ▼
   ┌──────┐ ┌──────┐ ┌──────────┐  ┌──────────┐
   │Local │ │GoPlus│ │ Gemini   │  │Firebase  │
   │Sanct.│ │ API  │ │ Nano AI  │  │(Optional)│
   │List  │ │      │ │(On-Device)│ │          │
   └──────┘ └──────┘ └──────────┘  └──────────┘
```

### 🛠️ Technology Stack

**Frontend**
- **Vanilla JavaScript** for maximum performance (no framework overhead)
- Custom CSS with a beautiful lilac-themed UI
- Responsive design that works across screen sizes

**Security Intelligence**
- **GoPlus Security API**: Real-time threat intelligence for Web3
- **Custom Sanctions Database**: Curated from ARPA Wallet Screening datasets
- **Blockchain RPC Calls**: Direct queries to Ethereum, Base, Polygon nodes

**AI Layer**
- **Chrome Built-in AI (Gemini Nano)**: On-device language model
- **Custom Prompt Engineering**: Structured prompts for consistent security analysis
- **Fallback Logic**: Graceful degradation when AI is unavailable

**Data Management**
- **Chrome Storage API**: Local caching and settings
- **Firebase** (optional): Cloud sync for audit trail
- **Chrome Identity API**: Secure OAuth for Firebase authentication

### 📊 Development Process

**Phase 1: Foundation (Days 1-2)**
- Built core address detection engine with regex patterns
- Implemented basic highlighting with color-coded spans
- Set up background service worker and message passing

**Phase 2: Security Integration (Days 3-4)**
- Integrated GoPlus Security API for threat intelligence
- Imported and normalized ARPA sanctions datasets
- Built sanctions database with 36 verified malicious addresses

**Phase 3: AI Enhancement (Days 5-6)**
- Implemented Gemini Nano AI integration
- Developed prompt engineering system for security analysis
- Created fallback analysis for when AI is unavailable

**Phase 4: User Experience (Days 7-8)**
- Designed and built popup dashboard with 4 tabs (Scan, Page, History, Settings)
- Added "My Addressbook" for saving trusted addresses with custom tags
- Implemented audit trail with configurable retention
- Added filter pills for easy sorting by threat level

**Phase 5: Polish & Documentation (Days 9-10)**
- Comprehensive testing across multiple Web3 sites
- Created detailed documentation and setup guides
- Fixed edge cases and performance optimizations

---

## Challenges we ran into

### Chrome's AI API was brand new
**Problem**: Chrome's Built-in AI (Gemini Nano) was released just weeks before the hackathon. Documentation was sparse, examples were limited, and the API behavior was unpredictable.

**Solution**: We dove deep into Chrome's developer forums, experimented extensively, and built robust error handling. We implemented a fallback system that provides basic analysis even when AI fails, ensuring users always get *some* protection.

**Key Learning**: We discovered that Gemini Nano's context window is limited, so we had to engineer concise prompts that fit critical information while still getting high-quality responses.

### Highlighting addresses without breaking websites
**Problem**: Injecting colored spans around addresses on arbitrary websites is *hard*. We broke layouts, interfered with website functionality, and caused React apps to crash.

**Solution**: We developed a sophisticated DOM manipulation strategy:
- Walk text nodes without touching existing HTML structure
- Use `MutationObserver` to handle dynamic content without performance penalties
- Apply CSS with high specificity to avoid conflicts
- Debounce rescanning to prevent infinite loops

**Result**: H3 Aspis now works seamlessly on complex sites like Etherscan, Uniswap, and even Twitter without breaking anything.

### Performance at scale
**Problem**: A single page might contain dozens of addresses. Analyzing each one individually would take minutes and hammer APIs with rate limits.

**Solution**: We implemented a multi-layer optimization strategy:
- **Caching**: Store results for 1 hour to avoid re-analyzing the same address
- **Deduplication**: Track pending analyses to prevent duplicate requests
- **Sequential Processing**: Analyze addresses one at a time to avoid overwhelming APIs
- **Tiered Checking**: Fast local checks first, then expensive API calls only if needed

**Result**: We went from 30+ seconds per page to **under 3 seconds** even with 10+ addresses.

### Privacy vs. functionality trade-off
**Problem**: To provide great security, we needed to call external APIs. But we promised users their privacy would be protected. How do you balance these competing needs?

**Solution**: We designed a **privacy-first architecture**:
- AI runs **entirely on-device** using Gemini Nano (zero data sent to Google)
- Sanctions database is **100% local** (no external calls)
- Only address hashes sent to GoPlus (no wallet data, no browsing history)
- Firebase integration is **opt-in** (disabled by default)
- Transparent about every API call in our documentation

**Result**: Users get robust security without sacrificing privacy.

### Dataset normalization
**Problem**: We had access to amazing ARPA Wallet Screening datasets (FBI Lazarus Group, Israeli NBCTF, OFAC sanctions), but they were in different formats—CSV, JSON, varying schemas.

**Solution**: We built `normalization_tool.py` to:
- Parse multiple input formats
- Deduplicate across datasets
- Validate Ethereum addresses
- Generate a unified `sanctioned-wallets.js` file

**Result**: A clean, 36-address sanctions database with verified sources and categories on Ethereum Mainnet, and thousands of sanctioned wallet across other EVM Chains and Bitcoin.

---

## Accomplishments that we're proud of

### 🏆 Technical Achievements

**1. Sub-3-Second Analysis Pipeline**
We built a sophisticated 3-tier security system that completes in under 3 seconds:
- Local sanctions check: **< 10ms**
- GoPlus API query: **< 1 second**
- AI analysis: **< 2 seconds**
- Total: **< 3 seconds** ⚡

**2. Zero-Compromise Privacy**
We proved you can build powerful security tools *without* sacrificing user privacy. By leveraging on-device AI and local databases, Web3 ASP protects users without collecting their data.

**3. Production-Ready Extension**
Web3 ASP isn't just a hackathon demo—it's a fully functional extension with:
- Comprehensive error handling
- Graceful degradation (works even if AI/APIs fail)
- Beautiful, intuitive UI
- 385+ lines of documentation
- Developer guide for contributors

**4. Real Sanctions Database**
We didn't use fake data. Our sanctions database includes **36 verified addresses on Ethereum Mainnet** and thousands more across other chains from:
- FBI's Lazarus Group (North Korean threat actors)
- OFAC sanctioned entities (Tornado Cash, mixers)
- Israeli NBCTF crypto terrorism financing cases
- Verified malicious smart contracts and scam wallets

### 🎨 Design Achievements

**Beautiful Lilac-Themed UI**
- Custom color palette that's easy on the eyes
- Clean, modern design inspired by Web3 aesthetics
- Intuitive tab-based navigation
- Responsive layout that works on any screen size

**Seamless Integration**
- Highlights blend naturally into existing page designs
- Hover tooltips don't obstruct content
- Colors are accessible (WCAG AA compliant)

### 📚 Documentation Achievements

We wrote **extensive documentation** because we want others to learn from and build upon our work:
- Comprehensive README with setup guides
- Developer guide with architecture diagrams
- Smart contract security strategy document
- Quick test guides and debug notes

---

## What we learned

### 🧠 Technical Lessons

**1. On-Device AI is the future of privacy**
Working with Gemini Nano showed us that powerful AI doesn't need to run in the cloud. On-device models protect user privacy while delivering fast results. This is a game-changer for security tools.

**2. Browser extensions are more powerful than we thought**
Chrome extensions can do *so much*—from injecting scripts into arbitrary pages to running background workers that orchestrate complex analysis pipelines. We barely scratched the surface.

**3. Security is multi-dimensional**
There's no single "security check" that catches everything. Real security requires layered defenses:
- Static databases for known threats
- Behavioral APIs for emerging threats
- AI for contextual analysis
- Human-readable explanations for user education

**4. Performance requires discipline**
We learned to obsess over every millisecond:
- Cache aggressively
- Debounce expensive operations
- Use efficient data structures (Map > Object for lookups)
- Measure everything (console.time is your friend)

### 🎨 UX Lessons

**1. Color coding is powerful but needs consistency**
Users instantly understand traffic light colors (green = good, red = bad). But we also learned that context matters—purple for "addressbook" isn't intuitive without explanation, so we added tooltips everywhere.

**2. Less is more**
Our first popup had 6 tabs and dozens of settings. It was overwhelming. We simplified to 4 core tabs (Scan, Page, History, Settings) and moved advanced features to collapsible sections. We added filter pills for quick access to specific threat levels.

**3. Trust requires transparency**
Users need to understand *why* an address is flagged. Vague warnings create fear without actionability. Detailed explanations build trust and educate users about Web3 security.

### 🤝 Team Lessons

**1. Documentation is development**
Writing docs isn't a chore—it's part of building the product. Good documentation forces you to think clearly about architecture, catches bugs, and makes your project accessible.

**2. Build for hackathons like you're building for production**
We could have cut corners with fake data and placeholder features. Instead, we built a *real* product. That discipline resulted in something we're genuinely proud to ship.

---

## What's next for Web3 ASP (H3 Aspis)

We're just getting started. Although this started as a side-proejct, we took feedback from Web3 savvy users and come up with an extensive roadmap:

### Short-Term

**Multi-Chain Expansion**
- Arbitrum, Optimism, Avalanche, BSC support
- Cross-chain address tracking (same entity, different chains)
- Chain-specific risk patterns

**Enhanced Smart Contract Analysis**
- Source code vulnerability scanning (reentrancy, overflow, access control)
- Contract dependency analysis (what other contracts does it call?)
- Token approval checker (what permissions have you granted?)

**Community Features**
- User-reported scams (crowdsourced threat intelligence)
- Trust score based on community feedback
- Public API for other developers to integrate H3 Aspis data

### 🎯 Mid-Term (6 Months+)

**Transaction Simulation**
- Preview transaction outcomes *before* signing
- Show token balance changes, approval grants, and hidden fees
- Integration with MetaMask, WalletConnect

**NFT Security**
- Metadata analysis (is this image legitimate or stolen?)
- Collection authenticity verification
- Fake NFT detection

**Phishing Protection**
- Website reputation scoring
- Fake domain detection (etherscan.com vs etherscan.cm)
- Browser-wide warnings for known phishing sites

### 🌟 Long-Term (1 Year+)

**AI-Powered Threat Intelligence**
- Continuously learning from new scams
- Predictive analysis (identify scams before they're reported)
- Natural language queries ("Is this contract safe?" → detailed analysis)

**Enterprise Features**
- Team addressbooks (shared trusted addresses)
- Compliance reporting (for institutions)
- Custom rule engines (define your own security policies)

**Developer Ecosystem**
- H3 Aspis API for dApp integration
- SDK for embedding security checks in wallets
- Open-source threat intelligence feed

### 💡 Moonshots (The Big Vision)

**Make Web3 as safe as Web2**
Our ultimate goal is to eliminate the "Wild West" reputation of Web3. We envision a future where:
- Users browse blockchain sites with confidence
- Scammers are detected and blocked in real-time
- Security is *invisible* (it just works)
- Education happens naturally (users learn security through using the tool)

**Become the Web3 Security Standard**
We want Web3 ASP to be as ubiquitous as antivirus software. Every wallet, every dApp, every blockchain explorer should integrate our technology. We're building the foundation for a safer Web3 ecosystem.

---

## Try Web3 ASP Today

Web3 ASP is **completely free and open-source**. No paywalls, no gated features, no compromises.

**Get Started:**
1. Clone the repo: `https://github.com/arpahls/web3-asp`
2. Load the extension in Chrome (Developer Mode)
3. Visit Etherscan or Uniswap and watch the magic happen

**Links:**
- 🔗 **GitHub**: [github.com/arpahls/web3-asp](https://github.com/arpahls/web3-asp)
- 📚 **Documentation**: See our comprehensive README and Developer Guide
- 🛡️ **Philosophy**: Privacy-first, user-centric, community-driven

---

## Closing Thoughts

Building this extension has been an incredible journey. We started with a simple idea—"make Web3 safer"—and ended up building a sophisticated security platform that protects privacy while delivering real-time threat intelligence.

But more than the technology, we're proud of the *mission*. Every day, someone loses money to a scam. Every day, someone gets discouraged and leaves Web3 because it feels too risky. Web3 ASP is our contribution to solving that problem.

**We're not just building a Chrome extension. We're building a safer future for Web3.**

Thank you for considering our submission for this hackathon. We can't wait to hear your feedback and continue improving this tool for the Web3 community.

---

**Made with 💜 by the ARPA Team**

*Protecting the Web3 ecosystem, one address at a time* 🛡️

**Frontend:** JavaScript, HTML5, CSS3, Chrome Manifest V3
**AI/ML:** Google Gemini Nano (on-device), Chrome Prompt API
**Blockchain:** Ethereum, Base, Polygon, Web3 RPC, Etherscan/Basescan/Polygonscan APIs
**Security:** GoPlus Security API, ARPA Datasets, OFAC/FBI/NBCTF Sanctions Lists
**Cloud:** Firebase (Firestore, Auth), Google OAuth
**Infrastructure:** Alchemy, Infura, Node.js, Python
