'use strict';

const DEFAULT_HOME = 'https://example.com/';

function resolveNavigation(input) {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  if (!value || /[\u0000-\u0020\u007f]/.test(value)) return null;

  // Reject explicit non-web schemes before applying the HTTPS shorthand.
  if (/^[a-z][a-z0-9+.-]*:/i.test(value) && !/^https?:\/\//i.test(value)) return null;
  if (value.startsWith('//') || value.includes('\\')) return null;

  let url;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : 'https://' + value);
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
