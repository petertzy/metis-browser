'use strict';

// Only the top-level, trusted toolbar frame may issue browser commands.
// Sender webContents identity alone does not distinguish child frames.
function isTrustedToolbarSender(event, toolbarContents) {
  if (!event || !toolbarContents || !event.senderFrame) return false;
  if (typeof toolbarContents.isDestroyed !== 'function' || toolbarContents.isDestroyed()) return false;
  return event.sender === toolbarContents &&
    event.senderFrame === toolbarContents.mainFrame;
}

module.exports = { isTrustedToolbarSender };
