'use strict';

const fs = require('node:fs');

function evaluateAudit(report) {
  if (!report || typeof report !== 'object' || !report.metadata ||
      !report.metadata.vulnerabilities) {
    throw new Error('Missing npm audit vulnerability metadata');
  }
  const counts = report.metadata.vulnerabilities;
  for (const key of ['critical', 'high']) {
    if (!Number.isSafeInteger(counts[key]) || counts[key] < 0) {
      throw new Error('Invalid npm audit count: ' + key);
    }
  }
  return { critical: counts.critical, high: counts.high,
    blocked: counts.critical > 0 || counts.high > 0 };
}

if (require.main === module) {
  try {
    const result = evaluateAudit(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')));
    console.log('Dependency audit severity gate:', JSON.stringify(result));
    if (result.blocked) {
      console.error('Critical or high dependency vulnerabilities require triage');
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('Dependency audit could not be verified:', error.message);
    process.exitCode = 1;
  }
}

module.exports = { evaluateAudit };
