// The public address of the app, used inside every QR code.
// Order: PUBLIC_BASE_URL (set this once you have a custom domain),
// RENDER_EXTERNAL_URL (set automatically by Render), then the address the
// request came in on.
function getPublicBaseUrl(req) {
  const fromEnv = process.env.PUBLIC_BASE_URL || process.env.RENDER_EXTERNAL_URL;
  const base = fromEnv || `${req.protocol}://${req.get('host')}`;
  return base.replace(/\/+$/, '');
}

module.exports = { getPublicBaseUrl };
