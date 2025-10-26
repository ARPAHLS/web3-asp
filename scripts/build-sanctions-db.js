// Script to build comprehensive sanctions database from ARPA datasets
// Run with: node scripts/build-sanctions-db.js

const fs = require('fs');
const path = require('path');

// Path to ARPA datasets
const DATASETS_PATH = '../../ARPA Wallet Screening/datasets/';

// Output path
const OUTPUT_PATH = '../data/sanctioned-wallets.js';

const sanctionedWallets = [];
const addressSet = new Set(); // To avoid duplicates

console.log('[Build] Loading FBI Lazarus dataset...');
try {
  const fbiData = JSON.parse(
    fs.readFileSync(path.join(__dirname, DATASETS_PATH, 'normalized_fbi_lazarus_20250722_180019.json'), 'utf8')
  );
  
  fbiData.forEach(entry => {
    const addr = entry.address.toLowerCase().trim();
    
    // Only include Ethereum addresses (0x...)
    if (!addr.startsWith('0x') || addressSet.has(addr)) {
      return;
    }
    
    addressSet.add(addr);
    sanctionedWallets.push({
      address: addr,
      name: entry.label || 'Lazarus Group',
      type: 'sanctions',
      source: entry.source || 'FBI',
      reason: `${entry.reason || 'North Korean state-sponsored hacking group'}`,
      jurisdictions: [entry.jurisdiction || 'US'],
      severity: 'critical',
      dateAdded: '2025-07-22',
      references: [entry.source_url],
      tags: ['lazarus', 'north-korea', 'state-sponsored', 'fbi'],
      network: entry.network
    });
  });
  
  console.log(`[Build] Added ${fbiData.length} FBI Lazarus entries`);
} catch (error) {
  console.error('[Build] Error loading FBI data:', error.message);
}

console.log('[Build] Loading Israel NBCTF dataset...');
try {
  const nbctfData = JSON.parse(
    fs.readFileSync(path.join(__dirname, DATASETS_PATH, 'normalized_israel_nbctf_20250722_180019.json'), 'utf8')
  );
  
  let addedCount = 0;
  nbctfData.forEach(entry => {
    let addr = entry.address.toLowerCase().trim();
    
    // Clean up address (remove zero-width spaces and special characters)
    addr = addr.replace(/[\u200B-\u200D\uFEFF]/g, '');
    
    // Only include Ethereum addresses
    if (!addr.startsWith('0x') || addressSet.has(addr)) {
      return;
    }
    
    addressSet.add(addr);
    addedCount++;
    
    sanctionedWallets.push({
      address: addr,
      name: entry.extra?.name || 'Israel NBCTF Sanctioned',
      type: 'sanctions',
      source: entry.source || 'Israeli NBCTF',
      reason: entry.reason || 'Israeli National Bureau for Counter Terror Financing sanctions',
      jurisdictions: [entry.jurisdiction || 'IL'],
      severity: 'critical',
      dateAdded: entry.extra?.start_date || '2025-07-22',
      references: [entry.source_url],
      tags: ['nbctf', 'israel', 'terrorism-financing', 'hamas'],
      network: entry.network,
      extra: entry.extra
    });
  });
  
  console.log(`[Build] Added ${addedCount} Israel NBCTF entries`);
} catch (error) {
  console.error('[Build] Error loading NBCTF data:', error.message);
}

console.log(`[Build] Total unique addresses: ${sanctionedWallets.length}`);

// Generate the output file
const fileContent = `// H3 Aspis - Comprehensive Sanctioned Wallets Database
// Auto-generated from ARPA Wallet Screening datasets
// Last Updated: ${new Date().toISOString().split('T')[0]}
// Total Entries: ${sanctionedWallets.length}

/**
 * Sanctioned Wallets Dataset Structure
 * Each entry contains:
 * - address: Ethereum address (lowercase, normalized)
 * - name: Entity or contract name
 * - type: 'mixer' | 'exchange' | 'scam' | 'hack' | 'ransomware' | 'darknet' | 'sanctions'
 * - source: Data source (OFAC, FBI, Chainalysis, Israeli NBCTF, etc.)
 * - reason: Why it's sanctioned/flagged
 * - jurisdictions: Blocked jurisdictions (array)
 * - severity: 'critical' | 'high' | 'medium'
 * - dateAdded: When added to sanctions
 * - references: URLs for verification (array)
 * - tags: Search tags (array)
 * - network: Blockchain network
 */

export const SANCTIONED_WALLETS = ${JSON.stringify(sanctionedWallets, null, 2)};

/**
 * Check if address is in sanctioned database
 * @param {string} address - Address to check (will be normalized)
 * @returns {Object|null} Sanctions details or null
 */
export function checkSanctionedWallet(address) {
  const normalized = address.toLowerCase().trim();
  
  const match = SANCTIONED_WALLETS.find(entry => 
    entry.address === normalized
  );
  
  if (!match) {
    return null;
  }
  
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
 * Get all sanctioned wallets by type
 * @param {string} type - Type filter
 * @returns {Array}
 */
export function getSanctionedByType(type) {
  return SANCTIONED_WALLETS.filter(entry => entry.type === type);
}

/**
 * Get all sanctioned wallets by source
 * @param {string} source - Source filter (e.g., 'OFAC', 'FBI', 'NBCTF')
 * @returns {Array}
 */
export function getSanctionedBySource(source) {
  return SANCTIONED_WALLETS.filter(entry => 
    entry.source.toLowerCase().includes(source.toLowerCase())
  );
}

/**
 * Get statistics about sanctioned wallets
 * @returns {Object}
 */
export function getSanctionsStats() {
  const byType = {};
  const bySeverity = {};
  const bySource = {};
  const byNetwork = {};
  
  SANCTIONED_WALLETS.forEach(entry => {
    byType[entry.type] = (byType[entry.type] || 0) + 1;
    bySeverity[entry.severity] = (bySeverity[entry.severity] || 0) + 1;
    
    if (!bySource[entry.source]) bySource[entry.source] = 0;
    bySource[entry.source]++;
    
    if (entry.network) {
      byNetwork[entry.network] = (byNetwork[entry.network] || 0) + 1;
    }
  });
  
  return {
    total: SANCTIONED_WALLETS.length,
    byType,
    bySeverity,
    bySource,
    byNetwork,
    lastUpdated: '${new Date().toISOString().split('T')[0]}'
  };
}

/**
 * Search sanctioned wallets by name or tags
 * @param {string} query
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

// Log statistics on load
console.log('[H3 Aspis] Sanctioned Wallets Database loaded:', getSanctionsStats());
`;

try {
  fs.writeFileSync(path.join(__dirname, OUTPUT_PATH), fileContent, 'utf8');
  console.log(`[Build] ✅ Successfully wrote ${sanctionedWallets.length} entries to ${OUTPUT_PATH}`);
  console.log('[Build] Database statistics:');
  
  const stats = {};
  sanctionedWallets.forEach(entry => {
    stats[entry.source] = (stats[entry.source] || 0) + 1;
  });
  
  Object.entries(stats).forEach(([source, count]) => {
    console.log(`  - ${source}: ${count} addresses`);
  });
} catch (error) {
  console.error('[Build] Error writing file:', error.message);
  process.exit(1);
}

console.log('[Build] Done!');

