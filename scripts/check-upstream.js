'use strict';

const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');

const SOURCES = Object.freeze({
  chromium: 'https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions?pageSize=1',
  electron: 'https://api.github.com/repos/electron/electron/releases/latest'
});

function parseMajor(version) {
  if (typeof version !== 'string') return null;
  const match = /^v?(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?(?:[-+].*)?$/.exec(version);
  return match ? Number(match[1]) : null;
}

function compareVersions(a, b) {
  const normalize = (value) => {
    const match = /^v?(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?/.exec(value);
    return match ? [match[1], match[2], match[3], match[4] || '0'].map(Number) : null;
  };
  const left = normalize(a);
  const right = normalize(b);
  if (!left || !right) return null;
  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) return Math.sign(left[i] - right[i]);
  }
  return 0;
}

function extractUpstreamVersions(chromiumResponse, electronResponse) {
  const chromium = chromiumResponse?.versions?.[0]?.version;
  const electron = electronResponse?.tag_name;
  if (parseMajor(chromium) === null || parseMajor(electron) === null) {
    throw new Error('Upstream returned an unexpected version response');
  }
  return { chromium, electron };
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: { 'User-Agent': 'metis-browser-upstream-monitor', Accept: 'application/json' },
      timeout: 15000
    }, (response) => {
      if (response.statusCode !== 200) {
        response.resume();
        reject(new Error('Upstream returned HTTP ' + response.statusCode));
        return;
      }
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
        if (body.length > 1024 * 1024) response.destroy(new Error('Response too large'));
      });
      response.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (error) { reject(error); }
      });
      response.on('error', reject);
    });
    request.on('timeout', () => request.destroy(new Error('Upstream request timed out')));
    request.on('error', reject);
  });
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const configuredElectron = manifest.devDependencies.electron;
  const [chromiumResponse, electronResponse] = await Promise.all([
    getJson(SOURCES.chromium), getJson(SOURCES.electron)
  ]);
  const upstream = extractUpstreamVersions(chromiumResponse, electronResponse);
  const report = [
    '# Metis upstream version report',
    '',
    '- Chromium Linux stable: ' + upstream.chromium,
    '- Electron latest published release: ' + upstream.electron,
    '- Electron configured range: ' + configuredElectron,
    '- Native Chromium baseline: not selected',
    '',
    'This is informational only. Version comparison does not establish security support,',
    'compatibility, or whether the configured dependency resolves to a patched release.'
  ].join('\n');
  console.log(report);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Upstream monitoring failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = { parseMajor, compareVersions, extractUpstreamVersions };
