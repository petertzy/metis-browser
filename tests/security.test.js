'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveNavigation, isAllowedNavigation } = require('../src/security');

test('accepts HTTP and HTTPS URLs and adds HTTPS to hostnames', () => {
  assert.equal(resolveNavigation('example.com'), 'https://example.com/');
  assert.equal(resolveNavigation('https://example.com/path'), 'https://example.com/path');
  assert.equal(resolveNavigation('http://example.com'), 'http://example.com/');
  assert.equal(resolveNavigation('localhost:8080'), 'https://localhost:8080/');
});

test('rejects unsafe schemes, credentials, ambiguous URLs, and controls', () => {
  for (const input of [
    'javascript:alert(1)', 'file:///etc/passwd', 'data:text/html,hi',
    'ftp://example.com', 'mailto:user@example.com', 'about:blank',
    'https://user:pass@example.com', '//example.com', 'https://example.com\\@evil.test',
    'https://example.com/\nalert', 'https://example.com/ path', 'https://example.com/\t',
    '', '   ', 'http://', 'https://',
  ]) {
    assert.equal(isAllowedNavigation(input), false, input);
  }
});

test('rejects non-string inputs', () => {
  for (const input of [null, undefined, 42, {}, []]) {
    assert.equal(resolveNavigation(input), null);
  }
});

test('page navigation requires explicit HTTP or HTTPS schemes', () => {
  const { isAllowedWebNavigation } = require('../src/security');
  for (const url of ['https://example.com/', 'http://example.com/']) {
    assert.equal(isAllowedWebNavigation(url), true, url);
  }
  for (const url of ['example.com', 'javascript:alert(1)', 'file:///tmp/a', 'about:blank', 'https://example.com/\t']) {
    assert.equal(isAllowedWebNavigation(url), false, url);
  }
});
