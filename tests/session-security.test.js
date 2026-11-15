'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { installSessionSecurity } = require('../src/session-security');

function mockSession() {
  const handlers = {};
  const session = {
    setPermissionRequestHandler: (handler) => { handlers.request = handler; },
    setPermissionCheckHandler: (handler) => { handlers.check = handler; },
    setDevicePermissionHandler: (handler) => { handlers.device = handler; },
    on: (name, handler) => { handlers[name] = handler; }
  };
  installSessionSecurity(session);
  return handlers;
}

test('rejects every requested website permission', () => {
  const handlers = mockSession();
  const contents = { getURL: () => 'https://example.com/' };
  for (const permission of ['geolocation', 'media', 'notifications', 'usb', 'hid', 'serial']) {
    let granted = null;
    handlers.request(contents, permission, (result) => { granted = result; });
    assert.equal(granted, false, permission);
    assert.equal(handlers.check(contents, permission), false, permission);
  }
});

test('rejects permission checks without webContents', () => {
  const handlers = mockSession();
  assert.equal(handlers.check(null, 'geolocation'), false);
});

test('rejects direct device access regardless of origin and device', () => {
  const handlers = mockSession();
  for (const details of [
    { origin: 'https://example.com', deviceType: 'usb', device: { vendorId: 1 } },
    { origin: 'https://example.com', deviceType: 'hid', device: {} },
    { origin: 'https://example.com', deviceType: 'serial', device: {} },
    {}
  ]) {
    assert.equal(handlers.device(details), false);
  }
});

test('prevents all downloads in the prototype', () => {
  const handlers = mockSession();
  let prevented = false;
  handlers['will-download'](
    { preventDefault: () => { prevented = true; } },
    { getURL: () => 'https://example.com/file.zip' }
  );
  assert.equal(prevented, true);
});
