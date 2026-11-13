'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  DENIED_PERMISSIONS, shouldGrantPermission, shouldAllowDownload
} = require('../src/permission-policy');

test('privileged website permissions are denied by default', () => {
  for (const permission of DENIED_PERMISSIONS) {
    assert.equal(shouldGrantPermission('https://example.com', permission), false);
  }
});

test('unknown and malformed permissions fail closed', () => {
  for (const permission of ['unknown', '', null, undefined]) {
    assert.equal(shouldGrantPermission('https://example.com', permission), false);
  }
});

test('downloads remain disabled until a reviewed download workflow exists', () => {
  assert.equal(shouldAllowDownload('https://example.com/file.zip'), false);
  assert.equal(shouldAllowDownload('file:///tmp/file'), false);
});
