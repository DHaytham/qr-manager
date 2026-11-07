const MAX_URL_LENGTH = 2048;

// Returns a clean absolute http(s) URL, or null if the input isn't one.
// "example.com" becomes "https://example.com/".
function normalizeUrl(input) {
  if (typeof input !== 'string') return null;
  let value = input.trim();
  if (!value || value.length > MAX_URL_LENGTH) return null;

  if (!/^[a-z][a-z0-9+.-]*:/i.test(value)) {
    value = `https://${value}`;
  }

  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
    return null;
  }
  return parsed.href;
}

module.exports = { normalizeUrl, MAX_URL_LENGTH };
