'use strict';

// Conservative prototype policy: websites receive no privileged permissions.
// Future exceptions must be explicitly scoped by origin and covered by tests.
const DENIED_PERMISSIONS = Object.freeze([
  'geolocation', 'media', 'notifications', 'midi', 'midiSysex',
  'pointerLock', 'fullscreen', 'openExternal', 'clipboardRead',
  'clipboardSanitizedWrite', 'idleDetection', 'serial', 'usb',
  'hid', 'bluetooth', 'display-capture'
]);

function shouldGrantPermission(_origin, _permission) {
  return false;
}

function shouldAllowDownload(_url) {
  // Downloads require an explicit UI and safe destination policy first.
  return false;
}

module.exports = { DENIED_PERMISSIONS, shouldGrantPermission, shouldAllowDownload };
