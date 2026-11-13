'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveNavigation, isAllowedNavigation } = require('../src/security');

test('accepts secure URLs and adds a secure scheme to hostnames', () => {
  assert.equal(resolveNavigation('example.com'), 'https://example.com/');
  assert.equal(resolveNavigation('https://example.com/path'), 'https://example.com/path');
  assert.equal(resolveNavigation('http://example.com'), 'http://example.com/');
});

test('rejects dangerous schemes, invalid URLs and credentials', () => {
  for (const input of [
    'javascript:alert(1)', 'file:///etc/passwd', 'data:text/html,hi',
    'ftp://example.com', 'https://user:pass@example.com',
    '', '   ', 'http://', 'https://example.com/\nalert'
  ]) {
    assert.equal(isAllowedNavigation(input), false, input);
  }
});
