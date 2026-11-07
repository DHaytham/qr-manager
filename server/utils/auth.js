const crypto = require('crypto');

// Simple single-admin auth without extra dependencies.
// The admin password comes from ADMIN_PASSWORD. After logging in, the client
// receives a signed token ("<expiresAt>.<signature>") that it sends back in the
// Authorization header. Changing ADMIN_PASSWORD or SESSION_SECRET logs everyone out.

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const DEV_DEFAULT_PASSWORD = 'admin';

function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV !== 'production') return DEV_DEFAULT_PASSWORD;
  return null; // production without a password: nobody can log in
}

function getSecret() {
  const password = getAdminPassword() || '';
  return process.env.SESSION_SECRET
    ? `${process.env.SESSION_SECRET}:${password}`
    : `qr-manager:${password}`;
}

function sign(value) {
  return crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function checkPassword(candidate) {
  const password = getAdminPassword();
  if (!password || typeof candidate !== 'string') return false;
  return safeEqual(candidate, password);
}

function createToken(now = Date.now()) {
  const expiresAt = now + TOKEN_TTL_MS;
  return { token: `${expiresAt}.${sign(`admin.${expiresAt}`)}`, expiresAt };
}

function verifyToken(token, now = Date.now()) {
  if (!getAdminPassword() || typeof token !== 'string') return false;
  const [expiresAtRaw, signature] = token.split('.');
  const expiresAt = Number(expiresAtRaw);
  if (!signature || !Number.isFinite(expiresAt) || expiresAt < now) return false;
  return safeEqual(signature, sign(`admin.${expiresAt}`));
}

function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!verifyToken(token)) {
    return res.status(401).json({ message: 'Please log in' });
  }
  next();
}

module.exports = {
  checkPassword,
  createToken,
  verifyToken,
  requireAuth,
  getAdminPassword,
  DEV_DEFAULT_PASSWORD,
};
