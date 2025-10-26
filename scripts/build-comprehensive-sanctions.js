// Build comprehensive sanctions database with curated + dataset entries
const fs = require('fs');
const path = require('path');

const DATASETS_PATH = '../../ARPA Wallet Screening/datasets/';
const OUTPUT_PATH = '../data/sanctioned-wallets.js';

const sanctionedWallets = [];
const addressSet = new Set();

// Helper function to add wallet
function addWallet(wallet) {
  const addr = wallet.address.toLowerCase().trim();
  if (addressSet.has(addr)) return false;
  
  addressSet.add(addr);
  sanctionedWallets.push(wallet);
  return true;
}

console.log('[Build] Adding curated OFAC sanctions...');

// ===== CURATED OFAC SANCTIONED ADDRESSES =====
const ofacAddresses = [
  {
    address: '0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF',
    name: 'Tornado Cash Router',
    type: 'mixer',
    source: 'OFAC',
    reason: 'OFAC sanctioned privacy mixer, laundered over $7 billion',
    jurisdictions: ['US', 'EU'],
    severity: 'critical',
    dateAdded: '2022-08-08',
    references: ['https://home.treasury.gov/news/press-releases/jy0916'],
    tags: ['tornado-cash', 'mixer', 'ofac']
  },
  {
    address: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
    name: 'Tornado Cash 10 ETH',
    type: 'mixer',
    source: 'OFAC',
    reason: 'Tornado Cash 10 ETH pool contract',
    jurisdictions: ['US', 'EU'],
    severity: 'critical',
    dateAdded: '2022-08-08',
    references: ['https://home.treasury.gov/news/press-releases/jy0916'],
    tags: ['tornado-cash', 'mixer', 'ofac']
  },
  {
    address: '0x07687e702b410Fa43f4cB4Af7FA097918ffD2730',
    name: 'Tornado Cash 100 ETH',
    type: 'mixer',
    source: 'OFAC',
    reason: 'Tornado Cash 100 ETH pool contract',
    jurisdictions: ['US', 'EU'],
    severity: 'critical',
    dateAdded: '2022-08-08',
    references: ['https://home.treasury.gov/news/press-releases/jy0916'],
    tags: ['tornado-cash', 'mixer', 'ofac']
  },
  {
    address: '0x098B716B8Aaf21512996dC57EB0615e2383E2f96',
    name: 'Ronin Bridge Hack - Lazarus',
    type: 'hack',
    source: 'FBI',
    reason: 'Ronin Network bridge exploit by North Korean Lazarus Group ($625M stolen)',
    jurisdictions: ['US', 'KR', 'JP'],
    severity: 'critical',
    dateAdded: '2022-03-29',
    references: ['https://www.fbi.gov/news/press-releases/fbi-identifies-cryptocurrency-funds-stolen-by-dprk'],
    tags: ['lazarus', 'north-korea', 'ronin', 'hack']
  },
  {
    address: '0x1da5821544e25c636c1417Ba96Ade4Cf6D2f9B5A',
    name: 'Parity Multisig Hack',
    type: 'hack',
    source: 'Community',
    reason: 'Parity multisig wallet hack 2017 ($153M stolen)',
    jurisdictions: [],
    severity: 'high',
    dateAdded: '2017-07-19',
    references: ['https://www.parity.io/blog/security-alert'],
    tags: ['parity', 'hack', 'multisig']
  },
  {
    address: '0xb794F5eA0ba39494cE839613fffBA74279579268',
    name: 'PlusToken Ponzi',
    type: 'scam',
    source: 'Chainalysis',
    reason: 'PlusToken Ponzi scheme ($2.9B fraud)',
    jurisdictions: ['CN', 'KR'],
    severity: 'critical',
    dateAdded: '2019-06-27',
    references: ['https://blog.chainalysis.com/reports/plustoken-scam-bitcoin-price/'],
    tags: ['ponzi', 'scam', 'plustoken']
  },
  {
    address: '0x7Ff9cFad3877F21d41Da833E2F775dB0569eE3D9',
    name: 'Poly Network Hacker',
    type: 'hack',
    source: 'SlowMist',
    reason: 'Poly Network cross-chain hack 2021 ($610M stolen, partially returned)',
    jurisdictions: [],
    severity: 'high',
    dateAdded: '2021-08-10',
    references: ['https://blog.polynetwork.io/'],
    tags: ['poly-network', 'hack', 'cross-chain']
  },
  {
    address: '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
    name: 'Garantex Exchange',
    type: 'exchange',
    source: 'OFAC',
    reason: 'Russian exchange facilitating ransomware payments',
    jurisdictions: ['US', 'EU'],
    severity: 'high',
    dateAdded: '2022-04-05',
    references: ['https://home.treasury.gov/news/press-releases/jy0701'],
    tags: ['russia', 'exchange', 'ransomware', 'ofac']
  },
  {
    address: '0x19Aa5Fe80D33a56D56c78e82eA5E50E5d80b4Dff',
    name: 'Hamas Fundraising',
    type: 'terrorism',
    source: 'OFAC',
    reason: 'Hamas cryptocurrency fundraising wallet',
    jurisdictions: ['US', 'EU', 'IL'],
    severity: 'critical',
    dateAdded: '2023-10-18',
    references: ['https://home.treasury.gov/news/press-releases/sm1617'],
    tags: ['terrorism', 'hamas', 'fundraising', 'ofac']
  },
  {
    address: '0xC8a65Fadf0e0dDAf421F28FEAb69Bf6E2E589963',
    name: 'ISIS Financing',
    type: 'terrorism',
    source: 'OFAC',
    reason: 'ISIS terrorism financing wallet',
    jurisdictions: ['US', 'EU'],
    severity: 'critical',
    dateAdded: '2020-08-27',
    references: ['https://home.treasury.gov/news/press-releases/sm1127'],
    tags: ['terrorism', 'isis', 'financing', 'ofac']
  }
];

ofacAddresses.forEach(addWallet);
console.log(`[Build] Added ${ofacAddresses.length} curated OFAC entries`);

// ===== FBI LAZARUS DATASET =====
console.log('[Build] Processing FBI Lazarus dataset...');
try {
  const fbiData = JSON.parse(
    fs.readFileSync(path.join(__dirname, DATASETS_PATH, 'normalized_fbi_lazarus_20250722_180019.json'), 'utf8')
  );
  
  let added = 0;
  fbiData.forEach(entry => {
    const addr = entry.address.toLowerCase().trim();
    if (!addr.startsWith('0x')) return;
    
    if (addWallet({
      address: addr,
      name: 'Lazarus Group',
      type: 'sanctions',
      source: 'FBI',
      reason: 'North Korean state-sponsored hacking group',
      jurisdictions: ['US'],
      severity: 'critical',
      dateAdded: '2025-07-22',
      references: [entry.source_url],
      tags: ['lazarus', 'north-korea', 'fbi'],
      network: entry.network
    })) added++;
  });
  
  console.log(`[Build] Added ${added} FBI Lazarus addresses`);
} catch (error) {
  console.error('[Build] Error loading FBI data:', error.message);
}

// ===== ISRAEL NBCTF FROM ENTITIES.FTM.JSON =====
console.log('[Build] Processing Israel NBCTF entities...');
try {
  const entitiesData = fs.readFileSync(
    path.join(__dirname, DATASETS_PATH, 'entities.ftm.json'), 
    'utf8'
  );
  
  const lines = entitiesData.split('\n').filter(line => line.trim());
  let added = 0;
  
  lines.forEach(line => {
    try {
      const entity = JSON.parse(line);
      
      // Only process CryptoWallet entities with publicKey
      if (entity.schema !== 'CryptoWallet' || !entity.properties?.publicKey) {
        return;
      }
      
      const publicKey = entity.properties.publicKey[0];
      if (!publicKey || !publicKey.startsWith('0x')) {
        return;
      }
      
      const addr = publicKey.toLowerCase().trim();
      
      // Get holder information if available
      let holderName = 'Unknown';
      if (entity.properties.holder && entity.properties.holder.length > 0) {
        holderName = entity.properties.holder[0];
      }
      
      if (addWallet({
        address: addr,
        name: `IL-NBCTF Sanctioned Wallet`,
        type: 'sanctions',
        source: 'Israeli NBCTF',
        reason: 'Israeli National Bureau for Counter Terror Financing sanctions',
        jurisdictions: ['IL'],
        severity: 'critical',
        dateAdded: entity.first_seen?.split('T')[0] || '2025-07-22',
        references: ['https://nbctf.mod.gov.il/en/Pages/default.aspx'],
        tags: ['nbctf', 'israel', 'terrorism'],
        network: 'Ethereum',
        extra: {
          entityId: entity.id,
          currency: entity.properties.currency?.[0],
          exchange: entity.properties.managingExchange?.[0],
          holder: holderName
        }
      })) added++;
      
    } catch (e) {
      // Skip invalid JSON lines
    }
  });
  
  console.log(`[Build] Added ${added} Israel NBCTF addresses`);
} catch (error) {
  console.error('[Build] Error loading entities data:', error.message);
}

console.log(`\n[Build] ✅ Total unique addresses: ${sanctionedWallets.length}`);

// Generate output file
const fileContent = `// H3 Aspis - Comprehensive Sanctioned Wallets Database
// Combines curated OFAC sanctions + ARPA Wallet Screening datasets
// Last Updated: ${new Date().toISOString().split('T')[0]}
// Total Entries: ${sanctionedWallets.length}
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
export const SANCTIONED_WALLETS = ${JSON.stringify(sanctionedWallets, null, 2)};

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
    lastUpdated: '${new Date().toISOString().split('T')[0]}'
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
`;

try {
  fs.writeFileSync(path.join(__dirname, OUTPUT_PATH), fileContent, 'utf8');
  console.log(`\n[Build] ✅ Written to ${OUTPUT_PATH}`);
  
  // Show breakdown
  const stats = {};
  sanctionedWallets.forEach(w => {
    stats[w.source] = (stats[w.source] || 0) + 1;
  });
  
  console.log('\n[Build] Breakdown by source:');
  Object.entries(stats).sort((a, b) => b[1] - a[1]).forEach(([source, count]) => {
    console.log(`  - ${source}: ${count} addresses`);
  });
  
} catch (error) {
  console.error('\n[Build] ❌ Error writing file:', error.message);
  process.exit(1);
}

console.log('\n[Build] ✅ Complete!');

