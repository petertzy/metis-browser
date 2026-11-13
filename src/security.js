'use strict';

const DEFAULT_HOME = 'https://example.com/';

function resolveNavigation(input) {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (!value || /[\u0000-\u001f\u007f]/.test(value)) return null;
  let url;
  try {
    url = new URL(value.includes('://') ? value : 'https://' + value);
  } catch {
    return null;
  }
  if (!['https:', 'http:'].includes(url.protocol)) return null;
  if (!url.hostname || url.username || url.password) return null;
  return url.toString();
}

function isAllowedNavigation(value) {
  return resolveNavigation(value) !== null;
}

module.exports = { DEFAULT_HOME, resolveNavigation, isAllowedNavigation };
