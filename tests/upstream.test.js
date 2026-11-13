'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseMajor, compareVersions, extractUpstreamVersions } = require('../scripts/check-upstream');

test('parses release versions and rejects arbitrary text', () => {
  assert.equal(parseMajor('v39.1.2'), 39);
  assert.equal(parseMajor('145.0.1000.5'), 145);
  assert.equal(parseMajor('^39.0.0'), null);
  assert.equal(parseMajor('latest'), null);
});

test('compares numeric release components rather than strings', () => {
  assert.equal(compareVersions('39.10.0', '39.9.0'), 1);
  assert.equal(compareVersions('39.0.0', '39.0.0'), 0);
  assert.equal(compareVersions('38.9.0', '39.0.0'), -1);
  assert.equal(compareVersions('invalid', '39.0.0'), null);
});

test('extracts versions from upstream response shapes', () => {
  assert.deepEqual(extractUpstreamVersions(
    { versions: [{ version: '145.0.1000.1' }] },
    { tag_name: 'v39.1.2' }
  ), { chromium: '145.0.1000.1', electron: 'v39.1.2' });
  assert.throws(() => extractUpstreamVersions({}, {}), /unexpected version/);
});
