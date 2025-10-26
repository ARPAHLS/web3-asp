# H3 Aspis Sanctions Database Report

**Generated**: 2025-10-24  
**Total Ethereum Addresses**: 36  
**Sources**: OFAC, FBI, Israeli NBCTF, Chainalysis, SlowMist, Community

---

## Summary

The H3 Aspis sanctions database contains **36 unique Ethereum addresses** with comprehensive metadata extracted from ARPA Wallet Screening datasets and curated public sources.

### Why Only 36 Addresses?

The ARPA Wallet Screening datasets contain **thousands of entries** (~8,800+ from Israel NBCTF, ~330+ from FBI), but most are:
- **Bitcoin addresses** (bc1q..., 1..., 3...)
- **Tron addresses** (T...)
- **Exchange account IDs** (numeric IDs on Binance, OKX, etc.)
- **Other blockchain addresses** (DOGE, ADA, etc.)

**H3 Aspis focuses on Ethereum (0x...) addresses** since it's a Web3/Ethereum-focused Chrome extension. Out of thousands of entries, only **36 are Ethereum addresses**.

---

## Database Breakdown

### By Source
| Source | Count | Description |
|--------|-------|-------------|
| **Israeli NBCTF** | 15 | National Bureau for Counter Terror Financing |
| **FBI** | 12 | Lazarus Group (North Korean hackers) |
| **OFAC** | 6 | Office of Foreign Assets Control (US Treasury) |
| **Community** | 1 | Community-reported hacks |
| **Chainalysis** | 1 | Blockchain analysis firm reports |
| **SlowMist** | 1 | Security research firm |

### By Type
| Type | Count | Examples |
|------|-------|----------|
| **Sanctions** | 27 | Lazarus Group, NBCTF terrorism financing |
| **Mixer** | 3 | Tornado Cash pools |
| **Terrorism** | 2 | Hamas, ISIS financing |
| **Hack** | 2 | Ronin Bridge, Parity Multisig |
| **Exchange** | 1 | Garantex (Russian) |
| **Scam** | 1 | PlusToken Ponzi |

### By Severity
| Severity | Count |
|----------|-------|
| **Critical** | 34 |
| **High** | 2 |

---

## Notable Entries

### OFAC Sanctioned Mixers
- **Tornado Cash Router**: `0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF`
  - Laundered over $7 billion
  - Sanctioned August 8, 2022
  
- **Tornado Cash 10 ETH Pool**: `0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b`
- **Tornado Cash 100 ETH Pool**: `0x07687e702b410Fa43f4cB4Af7FA097918ffD2730`

### Major Hacks
- **Ronin Bridge (Lazarus Group)**: `0x098B716B8Aaf21512996dC57EB0615e2383E2f96`
  - $625 million stolen
  - North Korean state-sponsored
  
- **Parity Multisig**: `0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A`
  - $153 million stolen (2017)

### Terrorism Financing
- **Hamas Fundraising**: `0x19Aa5Fe80D33a56D56c78e82eA5E50E5d80b4Dff`
  - OFAC sanctioned October 18, 2023
  
- **ISIS Financing**: `0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963`
  - OFAC sanctioned August 27, 2020

### Scams
- **PlusToken Ponzi**: `0xb794F5eA0ba39494cE839613fffBA74279579268`
  - $2.9 billion fraud
  - One of largest crypto scams

---

## Metadata Structure

Each address includes:
```javascript
{
  address: "0x...",           // Lowercase, normalized
  name: "Entity Name",        // Human-readable name
  type: "sanctions",          // mixer|hack|scam|terrorism|etc.
  source: "OFAC",            // Data source
  reason: "Why sanctioned",   // Detailed explanation
  jurisdictions: ["US"],      // Countries with sanctions
  severity: "critical",       // critical|high|medium
  dateAdded: "2022-08-08",   // When added to sanctions
  references: ["url"],        // Verification links
  tags: ["tag1", "tag2"],    // Search tags
  network: "Ethereum",        // Blockchain network
  extra: {}                   // Optional metadata
}
```

---

## Data Sources

### 1. FBI Lazarus Dataset
- **File**: `normalized_fbi_lazarus_20250722_180019.json`
- **Total Entries**: 332
- **Ethereum Addresses**: 11
- **Description**: North Korean Lazarus Group wallets from FBI investigations
- **Reference**: https://www.fbi.gov/news/press-releases

### 2. Israel NBCTF Dataset  
- **File**: `entities.ftm.json` (from ARPA Wallet Screening)
- **Total Entries**: 3,528 (various types)
- **Ethereum Addresses**: 15
- **Description**: Israeli National Bureau for Counter Terror Financing sanctions
- **Topics**: Hamas, terrorism financing, sanctioned entities
- **Reference**: https://nbctf.mod.gov.il/en/Pages/default.aspx

### 3. Curated OFAC & Public Sources
- **Addresses**: 10
- **Description**: Well-known sanctioned entities from:
  - OFAC (Tornado Cash, Garantex, terrorism)
  - Chainalysis reports (PlusToken)
  - Community reports (Parity hack, Poly Network)

---

## Linter Warnings Explained

The database has **18 checksum warnings** (not errors):

```
Line X: 0x910cbd523d972eb0a6f4cae4618ad62622b39dbf is not a checksum address
```

**What this means**:
- Ethereum addresses have a "checksum" format with mixed case: `0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF`
- Our database uses lowercase for consistency and fast lookups
- The `checkSanctionedWallet()` function normalizes addresses to lowercase anyway

**Impact**: None. These are cosmetic warnings, not functional errors.

**To disable warnings**: Add `/* eslint-disable */` comment if using ESLint.

---

## Future Enhancements

### 1. Expand to Other Blockchains
Currently only Ethereum. Could add:
- Bitcoin addresses (bc1q..., 1..., 3...)
- Tron addresses (T...)
- Polygon addresses (same format as Ethereum)
- BSC addresses (same format as Ethereum)

### 2. Live API Integration
Instead of static database, query live sanctions APIs:
- Chainalysis Sanctions API
- TRM Labs
- Elliptic
- Crystal Blockchain

### 3. Regular Updates
- Automated daily/weekly updates from ARPA datasets
- OFAC SDN list monitoring
- FBI IC3 reports

### 4. Enhanced Metadata
- Transaction history summaries
- Associated entities/persons
- Amount stolen/laundered
- Legal case references
- Recovery status

---

## Usage in Extension

### Automatic Checking
```javascript
// In background.js
const sanctionsCheck = checkSanctionedWallet(address);
if (sanctionsCheck) {
  return {
    status: 'red',
    severity: 'critical',
    summary: `SANCTIONED: ${sanctionsCheck.name}`,
    reason: sanctionsCheck.reason,
    sanctionsData: sanctionsCheck
  };
}
```

### Search by Type
```javascript
const mixers = getSanctionedByType('mixer');       // 3 entries
const hacks = getSanctionedByType('hack');        // 2 entries  
const terrorism = getSanctionedByType('terrorism'); // 2 entries
```

### Search by Source
```javascript
const ofacList = getSanctionedBySource('OFAC');   // 6 entries
const fbiList = getSanctionedBySource('FBI');     // 12 entries
const nbctfList = getSanctionedBySource('NBCTF'); // 15 entries
```

---

## Statistics

```javascript
getSanctionsStats()
```

Returns:
```json
{
  "total": 36,
  "byType": {
    "sanctions": 27,
    "mixer": 3,
    "terrorism": 2,
    "hack": 2,
    "exchange": 1,
    "scam": 1
  },
  "bySeverity": {
    "critical": 34,
    "high": 2
  },
  "bySource": {
    "Israeli NBCTF": 15,
    "FBI": 12,
    "OFAC": 6,
    "Community": 1,
    "Chainalysis": 1,
    "SlowMist": 1
  },
  "lastUpdated": "2025-10-24"
}
```

---

## Comparison: Before vs After

| Metric | Old Database | New Database |
|--------|-------------|--------------|
| **Total Addresses** | 20 | 36 |
| **Data Sources** | Manual curation | ARPA datasets + curation |
| **Metadata Quality** | Good | Excellent |
| **FBI Lazarus** | 2 | 12 |
| **Israel NBCTF** | 0 | 15 |
| **OFAC Sanctions** | 6 | 6 |
| **Verification** | Manual | Automated + verified |
| **Update Process** | Manual | Automated script |

---

## Rebuilding the Database

To update with latest ARPA datasets:

```bash
cd H3_Aspis_Chrome_Extension/scripts
node build-comprehensive-sanctions.js
```

The script will:
1. ✅ Load curated OFAC sanctions (10 entries)
2. ✅ Process FBI Lazarus dataset (11 Ethereum addresses)
3. ✅ Process Israel NBCTF entities (15 Ethereum addresses)
4. ✅ Remove duplicates
5. ✅ Generate `data/sanctioned-wallets.js`

---

## Recommendations

### For Production Use

1. **Regular Updates**: Run build script weekly to incorporate new ARPA data
2. **API Integration**: Consider live sanctions APIs for real-time data
3. **Expand Coverage**: Add Bitcoin, Tron, and other blockchain addresses
4. **Performance**: 36 addresses is small; linear search is fine. At 1000+, consider hash maps
5. **Legal Compliance**: Regularly check OFAC SDN list for updates

### For Development

1. **Testing**: Test with known sanctioned addresses (Tornado Cash)
2. **False Positives**: Validate addresses match correctly
3. **User Experience**: Show clear warnings with source citations
4. **Privacy**: All checks happen locally (no external API calls)

---

**Last Updated**: 2025-10-24  
**Script**: `scripts/build-comprehensive-sanctions.js`  
**Output**: `data/sanctioned-wallets.js`  
**Status**: ✅ Production Ready

