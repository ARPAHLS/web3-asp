// H3 Aspis - Comprehensive Sanctioned Wallets Database
// Combines curated OFAC sanctions + ARPA Wallet Screening datasets
// Last Updated: 2025-10-24
// Total Entries: 36
//
// Sources:
// - OFAC (Office of Foreign Assets Control)
// - FBI (Federal Bureau of Investigation)
// - Israeli NBCTF (National Bureau for Counter Terror Financing)
// - Chainalysis, SlowMist, Community Reports

/**
 * Sanctioned Wallets Dataset
 * Each entry contains complete metadata for threat intelligence
 */
export const SANCTIONED_WALLETS = [
  {
    "address": "0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF",
    "name": "Tornado Cash Router",
    "type": "mixer",
    "source": "OFAC",
    "reason": "OFAC sanctioned privacy mixer, laundered over $7 billion",
    "jurisdictions": [
      "US",
      "EU"
    ],
    "severity": "critical",
    "dateAdded": "2022-08-08",
    "references": [
      "https://home.treasury.gov/news/press-releases/jy0916"
    ],
    "tags": [
      "tornado-cash",
      "mixer",
      "ofac"
    ]
  },
  {
    "address": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
    "name": "Tornado Cash 10 ETH",
    "type": "mixer",
    "source": "OFAC",
    "reason": "Tornado Cash 10 ETH pool contract",
    "jurisdictions": [
      "US",
      "EU"
    ],
    "severity": "critical",
    "dateAdded": "2022-08-08",
    "references": [
      "https://home.treasury.gov/news/press-releases/jy0916"
    ],
    "tags": [
      "tornado-cash",
      "mixer",
      "ofac"
    ]
  },
  {
    "address": "0x07687e702b410Fa43f4cB4Af7FA097918ffD2730",
    "name": "Tornado Cash 100 ETH",
    "type": "mixer",
    "source": "OFAC",
    "reason": "Tornado Cash 100 ETH pool contract",
    "jurisdictions": [
      "US",
      "EU"
    ],
    "severity": "critical",
    "dateAdded": "2022-08-08",
    "references": [
      "https://home.treasury.gov/news/press-releases/jy0916"
    ],
    "tags": [
      "tornado-cash",
      "mixer",
      "ofac"
    ]
  },
  {
    "address": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96",
    "name": "Ronin Bridge Hack - Lazarus",
    "type": "hack",
    "source": "FBI",
    "reason": "Ronin Network bridge exploit by North Korean Lazarus Group ($625M stolen)",
    "jurisdictions": [
      "US",
      "KR",
      "JP"
    ],
    "severity": "critical",
    "dateAdded": "2022-03-29",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-cryptocurrency-funds-stolen-by-dprk"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "ronin",
      "hack"
    ]
  },
  {
    "address": "0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A",
    "name": "Parity Multisig Hack",
    "type": "hack",
    "source": "Community",
    "reason": "Parity multisig wallet hack 2017 ($153M stolen)",
    "jurisdictions": [],
    "severity": "high",
    "dateAdded": "2017-07-19",
    "references": [
      "https://www.parity.io/blog/security-alert"
    ],
    "tags": [
      "parity",
      "hack",
      "multisig"
    ]
  },
  {
    "address": "0xb794F5eA0ba39494cE839613fffBA74279579268",
    "name": "PlusToken Ponzi",
    "type": "scam",
    "source": "Chainalysis",
    "reason": "PlusToken Ponzi scheme ($2.9B fraud)",
    "jurisdictions": [
      "CN",
      "KR"
    ],
    "severity": "critical",
    "dateAdded": "2019-06-27",
    "references": [
      "https://blog.chainalysis.com/reports/plustoken-scam-bitcoin-price/"
    ],
    "tags": [
      "ponzi",
      "scam",
      "plustoken"
    ]
  },
  {
    "address": "0x7Ff9cFad3877F21d41Da833E2F775dB0569eE3D9",
    "name": "Poly Network Hacker",
    "type": "hack",
    "source": "SlowMist",
    "reason": "Poly Network cross-chain hack 2021 ($610M stolen, partially returned)",
    "jurisdictions": [],
    "severity": "high",
    "dateAdded": "2021-08-10",
    "references": [
      "https://blog.polynetwork.io/"
    ],
    "tags": [
      "poly-network",
      "hack",
      "cross-chain"
    ]
  },
  {
    "address": "0x7F367cC41522cE07553e823bf3be79A889DEbe1B",
    "name": "Garantex Exchange",
    "type": "exchange",
    "source": "OFAC",
    "reason": "Russian exchange facilitating ransomware payments",
    "jurisdictions": [
      "US",
      "EU"
    ],
    "severity": "high",
    "dateAdded": "2022-04-05",
    "references": [
      "https://home.treasury.gov/news/press-releases/jy0701"
    ],
    "tags": [
      "russia",
      "exchange",
      "ransomware",
      "ofac"
    ]
  },
  {
    "address": "0x19Aa5Fe80D33a56D56c78e82eA5E50E5d80b4Dff",
    "name": "Hamas Fundraising",
    "type": "terrorism",
    "source": "OFAC",
    "reason": "Hamas cryptocurrency fundraising wallet",
    "jurisdictions": [
      "US",
      "EU",
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2023-10-18",
    "references": [
      "https://home.treasury.gov/news/press-releases/sm1617"
    ],
    "tags": [
      "terrorism",
      "hamas",
      "fundraising",
      "ofac"
    ]
  },
  {
    "address": "0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963",
    "name": "ISIS Financing",
    "type": "terrorism",
    "source": "OFAC",
    "reason": "ISIS terrorism financing wallet",
    "jurisdictions": [
      "US",
      "EU"
    ],
    "severity": "critical",
    "dateAdded": "2020-08-27",
    "references": [
      "https://home.treasury.gov/news/press-releases/sm1127"
    ],
    "tags": [
      "terrorism",
      "isis",
      "financing",
      "ofac"
    ]
  },
  {
    "address": "0x94f1b9b64e2932f6a2db338f616844400cd58e8a",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "Ethereum"
  },
  {
    "address": "0xba36735021a9ccd7582ebc7f70164794154ff30e",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "Ethereum"
  },
  {
    "address": "0xbda83686c90314cfbaaeb18db46723d83fdf0c83",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "Ethereum"
  },
  {
    "address": "0x7d84d78bb9b6044a45fa08b7fe109f2c8648ab4e",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "Ethereum"
  },
  {
    "address": "0xff29a52a538f1591235656f71135c24019bf82e5",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "BSC"
  },
  {
    "address": "0x0004a76e39d33edfeac7fc3c8d3994f54428a0be",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "BSC"
  },
  {
    "address": "0xbcedc4f3855148df3ea5423ce758bda9f51630aa",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "BSC"
  },
  {
    "address": "0xe03a1ae400fa54283d5a1c4f8b89d3ca74afbd62",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "BSC"
  },
  {
    "address": "0x95b6656838a1d852dd1313c659581f36b2afb237",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "BSC"
  },
  {
    "address": "0xa2e898180d0bc3713025d8590615a832397a8032",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "Polygon"
  },
  {
    "address": "0xa26213638f79f2ed98d474cbcb87551da909685e",
    "name": "Lazarus Group",
    "type": "sanctions",
    "source": "FBI",
    "reason": "North Korean state-sponsored hacking group",
    "jurisdictions": [
      "US"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-22",
    "references": [
      "https://www.fbi.gov/news/press-releases/fbi-identifies-lazarus-group-cyber-actors-as-responsible-for-theft-of-41-million-from-stakecom"
    ],
    "tags": [
      "lazarus",
      "north-korea",
      "fbi"
    ],
    "network": "Polygon"
  },
  {
    "address": "0xc8fe1c81e927540fcc99ebb3c880a840082293da, tr2ntb64cqmx6tqfwisoc6o7barfwhhpiw",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-01afcb213a9f9af9139a6747c30efb3c3e8bc344",
      "holder": "Unknown"
    }
  },
  {
    "address": "0xc0d227bd0580bad9435ca0b884ebee7ff8da71c9",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-14c70eedc4f4aa7c3579467c440cd6eb19ba5333",
      "currency": "USDT",
      "holder": "il-nbctf-920579bec0143b02af1a0d9082ba74b7dac85276"
    }
  },
  {
    "address": "0x7eab248c014d1043e54e96ac4f31ec7d9a97ffd3",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2024-04-05",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-1e3094143f6dca0ed173cc5af7dc0c2ff0fcf17a",
      "holder": "Unknown"
    }
  },
  {
    "address": "0x175d44451403edf28469df03a9280c1197adb92c",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2024-04-05",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-319bae07e359bef7c45de5e3349f326743930a22",
      "holder": "Unknown"
    }
  },
  {
    "address": "0xc3b194e0a4bfff0e986594d7768f58746e52eb53",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-34cc87e5c4be2b51c1f5f0fff42173b10380e7b1",
      "holder": "il-nbctf-7c23017dfded1a30050e796f9379b6217c6329ed"
    }
  },
  {
    "address": "0xddd42d46a17b9a5b0c53c5ef2b79a6acb1b50333",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-52aaa3f009648756d1c7f1aee5f47592c07faf40",
      "currency": "ETH",
      "holder": "il-nbctf-d423c3c05ad0349f62e21e8b904b837c9930c19d"
    }
  },
  {
    "address": "0x11069987e8507d0669c870b578cc9f9b4017d127",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-5c5b06b8f2a2d85cddf7377295926cef014dbe88",
      "currency": "ETH",
      "holder": "il-nbctf-509ce980105e02650a9c694dd22bca34463623ff"
    }
  },
  {
    "address": "0xe090669ee62e02f4437b89058a073dc7874aed8f",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-64edbf85f9e7c93f2483c80894be8cba74c2d77b",
      "currency": "ETH",
      "holder": "Unknown"
    }
  },
  {
    "address": "0xad92a818e26fc3dbce7a1972308a4a86f54dd683",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-713594b70ed491ecab9ef2ed4b1f9c96614e3aa9",
      "currency": "USDT",
      "holder": "il-nbctf-a748c73d6d98ff0cc0b5fa4eb1ed8f32112c83f2"
    }
  },
  {
    "address": "0xc077bbfcf9b5b9eec0dd105e15b65ebc2a030600",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-74589d3fdd4897a22c5cdb471789a9d0282f157b",
      "currency": "USDT",
      "holder": "il-nbctf-a748c73d6d98ff0cc0b5fa4eb1ed8f32112c83f2"
    }
  },
  {
    "address": "0xe3740c1b2fcda407027e2c80906306604e5260e7",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-04",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-77eeb21744227b0e435ef90e6bdffa3478d32c60",
      "exchange": "NOBITEX",
      "holder": "Unknown"
    }
  },
  {
    "address": "0x99d29380a2e37c04e4fe75111b7d410674a6cab3",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-9c58603526dd7b625e3436ab2f4fad23cf657ecd",
      "currency": "ETH",
      "holder": "il-nbctf-34d89cdf2350fe93bea21e7bc1456704d70fa552"
    }
  },
  {
    "address": "0x21b8d56bda776bbe68655a16895afd96f5534fed",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2024-12-03",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-9e2677ec300a848d7c90e8b421175925b2fba3a8",
      "holder": "Unknown"
    }
  },
  {
    "address": "0xebfe7a29ea17acb5f6f437e659bd2d472deedc54",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-05-09",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-d65c853e37e7d0914410ad9b6b7178927db93a5e",
      "currency": "ETH",
      "holder": "il-nbctf-0971ba68691251502045c4f20f4dc5d30cd6a705"
    }
  },
  {
    "address": "0x53b9b72dc6f96eb4b54143b211b22e2548e4cf5c",
    "name": "IL-NBCTF Sanctioned Wallet",
    "type": "sanctions",
    "source": "Israeli NBCTF",
    "reason": "Israeli National Bureau for Counter Terror Financing sanctions",
    "jurisdictions": [
      "IL"
    ],
    "severity": "critical",
    "dateAdded": "2025-07-04",
    "references": [
      "https://nbctf.mod.gov.il/en/Pages/default.aspx"
    ],
    "tags": [
      "nbctf",
      "israel",
      "terrorism"
    ],
    "network": "Ethereum",
    "extra": {
      "entityId": "il-nbctf-f603de984087fc4b9cd9f51632f8a4b0e66f273e",
      "exchange": "NOBITEX",
      "holder": "Unknown"
    }
  }
];

/**
 * Check if address is sanctioned
 * @param {string} address - Address to check
 * @returns {Object|null} Sanctions info or null
 */
export function checkSanctionedWallet(address) {
  const normalized = address.toLowerCase().trim();
  const match = SANCTIONED_WALLETS.find(entry => entry.address === normalized);
  
  if (!match) return null;
  
  return {
    hit: true,
    address: match.address,
    name: match.name,
    type: match.type,
    source: match.source,
    reason: match.reason,
    severity: match.severity,
    jurisdictions: match.jurisdictions,
    dateAdded: match.dateAdded,
    references: match.references,
    tags: match.tags,
    network: match.network
  };
}

/**
 * Get sanctioned wallets by type
 * @param {string} type - Filter by type
 * @returns {Array}
 */
export function getSanctionedByType(type) {
  return SANCTIONED_WALLETS.filter(entry => entry.type === type);
}

/**
 * Get sanctioned wallets by source
 * @param {string} source - Filter by source
 * @returns {Array}
 */
export function getSanctionedBySource(source) {
  return SANCTIONED_WALLETS.filter(entry => 
    entry.source.toLowerCase().includes(source.toLowerCase())
  );
}

/**
 * Get database statistics
 * @returns {Object}
 */
export function getSanctionsStats() {
  const byType = {};
  const bySeverity = {};
  const bySource = {};
  
  SANCTIONED_WALLETS.forEach(entry => {
    byType[entry.type] = (byType[entry.type] || 0) + 1;
    bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
    bySource[entry.source] = (bySource[entry.source] || 0) + 1;
  });
  
  return {
    total: SANCTIONED_WALLETS.length,
    byType,
    bySeverity,
    bySource,
    lastUpdated: '2025-10-24'
  };
}

/**
 * Search sanctioned wallets
 * @param {string} query - Search query
 * @returns {Array}
 */
export function searchSanctioned(query) {
  const q = query.toLowerCase();
  return SANCTIONED_WALLETS.filter(entry => 
    entry.name.toLowerCase().includes(q) ||
    entry.reason.toLowerCase().includes(q) ||
    entry.tags.some(tag => tag.includes(q))
  );
}

// Log stats on load
console.log('[H3 Aspis] Sanctioned Wallets Database loaded:', getSanctionsStats());
