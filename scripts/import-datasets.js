#!/usr/bin/env node

/**
 * H3 Aspis - Dataset Import Script
 * 
 * This script converts ARPA Wallet Screening datasets into a format
 * suitable for the Chrome extension.
 * 
 * Usage:
 *   node scripts/import-datasets.js
 * 
 * Requirements:
 *   - Node.js installed
 *   - ARPA datasets in ../../ARPA Wallet Screening/datasets/
 */

const fs = require('fs');
const path = require('path');

// Paths
const ARPA_DATASETS_PATH = path.join(__dirname, '../../ARPA Wallet Screening/datasets');
const OUTPUT_PATH = path.join(__dirname, '../data/sanctions-dataset.js');

// Dataset files to process
const DATASET_FILES = {
  malicious: 'malicious_scs_2025.json',
  sanctions: 'entities.ftm.json',
  fbi: 'normalized_fbi_lazarus_20250722_180019.json',
  israel: 'normalized_israel_nbctf_20250722_180019.json',
  uniswap: 'normalized_uniswap_trm.json'
};

// Limits for each category (to keep extension size reasonable)
const LIMITS = {
  malicious: 200,
  scams: 100,
  sanctions: 500
};

/**
 * Main import function
 */
async function importDatasets() {
  console.log('H3 Aspis Dataset Import Tool');
  console.log('============================\n');
  
  const output = {
    malicious: [],
    scams: [],
    sanctions: []
  };
  
  // Import malicious contracts
  console.log('Importing malicious contracts...');
  const malicious = await importMaliciousContracts();
  output.malicious = malicious.slice(0, LIMITS.malicious);
  console.log(`✓ Imported ${output.malicious.length} malicious contracts\n`);
  
  // Import sanctions entities
  console.log('Importing sanctions entities...');
  const sanctions = await importSanctionsEntities();
  output.sanctions = sanctions.slice(0, LIMITS.sanctions);
  console.log(`✓ Imported ${output.sanctions.length} sanctions entities\n`);
  
  // Import normalized datasets (FBI, Israel, etc.)
  console.log('Importing normalized datasets...');
  const normalized = await importNormalizedDatasets();
  output.sanctions.push(...normalized.slice(0, LIMITS.sanctions - output.sanctions.length));
  console.log(`✓ Imported ${normalized.length} additional addresses\n`);
  
  // Generate output file
  console.log('Generating output file...');
  await generateOutputFile(output);
  console.log(`✓ Dataset file created at: ${OUTPUT_PATH}\n`);
  
  // Print summary
  console.log('Summary:');
  console.log(`  Malicious Contracts: ${output.malicious.length}`);
  console.log(`  Scams: ${output.scams.length}`);
  console.log(`  Sanctions: ${output.sanctions.length}`);
  console.log(`  Total Addresses: ${output.malicious.length + output.scams.length + output.sanctions.length}`);
}

/**
 * Import malicious contracts
 */
async function importMaliciousContracts() {
  try {
    const filePath = path.join(ARPA_DATASETS_PATH, DATASET_FILES.malicious);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    return data.map(item => ({
      address: item.address.toLowerCase(),
      label: item.name || 'Unknown',
      source: item.source || 'ARPA',
      reason: item.reason || 'Malicious contract',
      severity: item.severity || 'high'
    }));
    
  } catch (error) {
    console.error('Error importing malicious contracts:', error.message);
    return [];
  }
}

/**
 * Import sanctions entities
 */
async function importSanctionsEntities() {
  try {
    const filePath = path.join(ARPA_DATASETS_PATH, DATASET_FILES.sanctions);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.trim().split('\n');
    
    const entities = [];
    
    for (const line of lines) {
      try {
        const entity = JSON.parse(line);
        
        // Extract addresses from different formats
        let addresses = [];
        
        if (entity.addresses) {
          addresses = entity.addresses;
        } else if (entity.properties && entity.properties.address) {
          addresses = [entity.properties.address];
        }
        
        addresses.forEach(addr => {
          if (addr && addr.startsWith('0x')) {
            entities.push({
              address: addr.toLowerCase(),
              label: entity.schema || entity.label || 'Sanctioned Entity',
              source: entity.caption || 'OFAC/Sanctions',
              reason: entity.caption || 'Sanctioned address',
              severity: 'critical'
            });
          }
        });
        
      } catch (e) {
        // Skip invalid lines
      }
    }
    
    return entities;
    
  } catch (error) {
    console.error('Error importing sanctions entities:', error.message);
    return [];
  }
}

/**
 * Import normalized datasets
 */
async function importNormalizedDatasets() {
  const results = [];
  
  for (const [key, filename] of Object.entries(DATASET_FILES)) {
    if (key === 'malicious' || key === 'sanctions') continue;
    
    try {
      const filePath = path.join(ARPA_DATASETS_PATH, filename);
      
      if (!fs.existsSync(filePath)) {
        console.log(`  ⚠ ${filename} not found, skipping`);
        continue;
      }
      
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.address) {
            results.push({
              address: item.address.toLowerCase(),
              label: item.label || item.name || key,
              source: item.source || key,
              reason: item.reason || `${key} list`,
              severity: item.severity || 'high'
            });
          }
        });
      }
      
    } catch (error) {
      console.log(`  ⚠ Error importing ${filename}: ${error.message}`);
    }
  }
  
  return results;
}

/**
 * Generate output JavaScript file
 */
async function generateOutputFile(data) {
  const template = `// H3 Aspis - Sanctions and Malicious Addresses Dataset
// Auto-generated from ARPA Wallet Screening datasets
// Generated: ${new Date().toISOString()}

export const SANCTIONS_DATASET = ${JSON.stringify(data, null, 2)};

/**
 * Check if an address is in the sanctions/malicious database
 * @param {string} address - Address to check (lowercase)
 * @returns {Object|null} Match result or null
 */
export function checkSanctionsList(address) {
  address = address.toLowerCase();
  
  // Check malicious list
  const maliciousMatch = SANCTIONS_DATASET.malicious.find(
    entry => entry.address === address
  );
  
  if (maliciousMatch) {
    return {
      hit: true,
      type: 'malicious',
      label: maliciousMatch.label,
      source: maliciousMatch.source,
      reason: maliciousMatch.reason,
      severity: maliciousMatch.severity || 'high'
    };
  }
  
  // Check scams list
  const scamMatch = SANCTIONS_DATASET.scams.find(
    entry => entry.address === address
  );
  
  if (scamMatch) {
    return {
      hit: true,
      type: 'scam',
      label: scamMatch.label || 'Known Scam',
      source: scamMatch.source || 'Community Reports',
      reason: scamMatch.reason || 'Identified as fraudulent contract',
      severity: 'critical'
    };
  }
  
  // Check sanctions list
  const sanctionsMatch = SANCTIONS_DATASET.sanctions.find(
    entry => entry.address === address
  );
  
  if (sanctionsMatch) {
    return {
      hit: true,
      type: 'sanctions',
      label: sanctionsMatch.label,
      source: sanctionsMatch.source,
      reason: sanctionsMatch.reason || 'Sanctioned entity',
      severity: 'critical'
    };
  }
  
  return null;
}

/**
 * Get dataset statistics
 */
export function getDatasetStats() {
  return {
    maliciousCount: SANCTIONS_DATASET.malicious.length,
    scamsCount: SANCTIONS_DATASET.scams.length,
    sanctionsCount: SANCTIONS_DATASET.sanctions.length,
    totalAddresses: SANCTIONS_DATASET.malicious.length + 
                    SANCTIONS_DATASET.scams.length + 
                    SANCTIONS_DATASET.sanctions.length
  };
}

console.log('[H3 Aspis] Sanctions dataset loaded:', getDatasetStats());
`;
  
  fs.writeFileSync(OUTPUT_PATH, template, 'utf8');
}

// Run import
importDatasets().catch(error => {
  console.error('\n❌ Import failed:', error);
  process.exit(1);
});

