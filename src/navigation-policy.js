'use strict';

const { isAllowedWebNavigation } = require('./security');

// Reject non-web destinations before Chromium commits a navigation.
// Frame navigation is checked separately because will-navigate only covers
// main-frame navigations.
function installNavigationPolicy(contents) {
  const denyNonWebNavigation = (event, navigation) => {
    const url = typeof navigation === 'string' ? navigation : navigation && navigation.url;
    if (!isAllowedWebNavigation(url)) event.preventDefault();
  };

  contents.on('will-navigate', denyNonWebNavigation);
  contents.on('will-redirect', denyNonWebNavigation);
  contents.on('will-frame-navigate', denyNonWebNavigation);
}

module.exports = { installNavigationPolicy };
