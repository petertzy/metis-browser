'use strict';

const { shouldGrantPermission, shouldAllowDownload } = require('./permission-policy');

// Centralize the session's default-deny capability policy.
function installSessionSecurity(browsingSession) {
  browsingSession.setPermissionRequestHandler((contents, permission, callback) => {
    callback(shouldGrantPermission(contents.getURL(), permission));
  });
  browsingSession.setPermissionCheckHandler((contents, permission) => {
    return shouldGrantPermission(contents ? contents.getURL() : '', permission);
  });

  // Electron device permissions are independent from permission requests.
  // Explicitly reject access to USB, HID, and serial devices.
  browsingSession.setDevicePermissionHandler(() => false);

  browsingSession.on('will-download', (event, item) => {
    if (!shouldAllowDownload(item.getURL())) event.preventDefault();
  });
}

module.exports = { installSessionSecurity };
