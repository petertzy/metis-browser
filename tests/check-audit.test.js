'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { evaluateAudit } = require('../scripts/check-audit');

function report(critical, high) {
  return { metadata: { vulnerabilities: { critical, high, moderate: 3 } } };
}

test('passes when only moderate and lower findings exist', () => {
  assert.deepEqual(evaluateAudit(report(0, 0)), { critical: 0, high: 0, blocked: false });
});

test('blocks critical or high findings', () => {
  assert.equal(evaluateAudit(report(1, 0)).blocked, true);
  assert.equal(evaluateAudit(report(0, 2)).blocked, true);
});

test('fails closed for incomplete or malformed reports', () => {
  for (const input of [null, {}, { metadata: {} }, report(undefined, 0),
    report(0, -1), report('0', 0)]) {
    assert.throws(() => evaluateAudit(input));
  }
});
