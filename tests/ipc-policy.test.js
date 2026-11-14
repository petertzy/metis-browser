'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isTrustedToolbarSender } = require('../src/ipc-policy');

function makeToolbar() {
  const mainFrame = {};
  return { mainFrame, isDestroyed: () => false };
}

test('accepts IPC only from the toolbar main frame', () => {
  const toolbar = makeToolbar();
  assert.equal(isTrustedToolbarSender({
    sender: toolbar,
    senderFrame: toolbar.mainFrame
  }, toolbar), true);
});

test('rejects child frames even when webContents matches', () => {
  const toolbar = makeToolbar();
  assert.equal(isTrustedToolbarSender({
    sender: toolbar,
    senderFrame: {}
  }, toolbar), false);
});

test('rejects unrelated senders and missing frames', () => {
  const toolbar = makeToolbar();
  const foreign = makeToolbar();
  assert.equal(isTrustedToolbarSender({ sender: foreign, senderFrame: foreign.mainFrame }, toolbar), false);
  assert.equal(isTrustedToolbarSender({ sender: toolbar }, toolbar), false);
  assert.equal(isTrustedToolbarSender(null, toolbar), false);
  assert.equal(isTrustedToolbarSender({ sender: toolbar, senderFrame: toolbar.mainFrame }, null), false);
});

test('rejects IPC when the toolbar has been destroyed', () => {
  const toolbar = makeToolbar();
  toolbar.isDestroyed = () => true;
  assert.equal(isTrustedToolbarSender({ sender: toolbar, senderFrame: toolbar.mainFrame }, toolbar), false);
});
