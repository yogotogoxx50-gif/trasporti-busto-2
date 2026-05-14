const fs = require('fs');
const path = require('path');

// Collect all stop codes from data files
const dataDir = path.join(__dirname, '..', 'data');
const codes = new Set();
['z625','z627','z642','z644','z647','z649'].forEach(f => {
  const content = fs.readFileSync(path.join(dataDir, f + '.js'), 'utf8');
  const re = /"([A-Z]{2}\d{3})"\s*:/g;
  let m;
  while (m = re.exec(content)) {
    codes.add(m[1]);
  }
});

// Parse STOP_NAMES from line-config.js
const lcContent = fs.readFileSync(path.join(__dirname, '..', 'js', 'line-config.js'), 'utf8');
const defined = new Set();
const re2 = /\b([A-Z]{2}\d{3})\b\s*:/g;
let m2;
while (m2 = re2.exec(lcContent)) {
  defined.add(m2[1]);
}

const missing = [...codes].filter(c => !defined.has(c)).sort();
console.log('All unique stop codes in data files:', codes.size);
console.log('Defined in STOP_NAMES:', defined.size);
console.log('\nMissing from STOP_NAMES (' + missing.length + '):');
missing.forEach(c => console.log('  ' + c));
