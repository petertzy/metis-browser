'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { installNavigationPolicy } = require('../src/navigation-policy');

function handlers() {
  const events = {};
  installNavigationPolicy({ on: (name, callback) => { events[name] = callback; } });
  return events;
}

test('installs main-frame, redirect, and subframe navigation guards', () => {
  const events = handlers();
  assert.deepEqual(Object.keys(events).sort(), [
    'will-frame-navigate', 'will-navigate', 'will-redirect'
  ]);
});

test('blocks unsafe schemes and credentials for all navigation events', () => {
  const events = handlers();
  for (const [name, handler] of Object.entries(events)) {
    for (const url of [
      'file:///etc/passwd', 'javascript:alert(1)', 'data:text/html,hello',
      'about:blank', 'https://user:pass@example.com/', 'https://example.com/\n',
      undefined
    ]) {
      let prevented = false;
      const event = { preventDefault: () => { prevented = true; } };
      handler(event, name === 'will-frame-navigate' ? { url } : url);
      assert.equal(prevented, true, `${name}: ${String(url)}`);
    }
  }
});

test('allows normal HTTP and HTTPS navigation including subframes', () => {
  const events = handlers();
  for (const [name, handler] of Object.entries(events)) {
    for (const url of ['https://example.com/', 'http://example.com/path']) {
      let prevented = false;
      handler({ preventDefault: () => { prevented = true; } },
        name === 'will-frame-navigate' ? { url } : url);
      assert.equal(prevented, false, `${name}: ${url}`);
    }
  }
});
