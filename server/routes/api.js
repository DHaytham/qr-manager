const crypto = require('crypto');
const express = require('express');
const rateLimit = require('express-rate-limit');
const QRCode = require('qrcode');
const Card = require('../models/Card');
const { getPublicBaseUrl } = require('../config');
const { checkPassword, createToken, requireAuth } = require('../utils/auth');
const { normalizeUrl } = require('../utils/urls');

const router = express.Router();

// Wraps async handlers so errors reach the error middleware instead of crashing.
const handle = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Try again in 15 minutes.' },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

// Reads an optional URL from the request body.
// Returns { url } (null when empty) or { error }.
function readCustomerUrl(body) {
  const raw = body && typeof body.customerUrl === 'string' ? body.customerUrl.trim() : '';
  if (!raw) return { url: null };
  const url = normalizeUrl(raw);
  if (!url) return { error: 'Please enter a valid web address starting with http:// or https://' };
  return { url };
}

async function newCardId() {
  // 8 URL-safe random characters, e.g. "q3Xk-9aB". Retry on the (very unlikely) collision.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const id = crypto.randomBytes(6).toString('base64url');
    // eslint-disable-next-line no-await-in-loop
    if (!(await Card.findByPk(id))) return id;
  }
  throw new Error('Could not generate a unique card id');
}

// ---- Auth ----

router.post('/login', loginLimiter, (req, res) => {
  if (!checkPassword(req.body && req.body.password)) {
    return res.status(401).json({ message: 'Wrong password' });
  }
  res.json(createToken());
});

router.get('/session', requireAuth, (req, res) => res.json({ ok: true }));

// ---- Cards (admin only) ----

router.use(['/generate', '/cards'], adminLimiter, requireAuth);

router.post(
  '/generate',
  handle(async (req, res) => {
    const { url, error } = readCustomerUrl(req.body);
    if (error) return res.status(400).json({ message: error });

    const id = await newCardId();
    const redirectUrl = `${getPublicBaseUrl(req)}/r/${id}`;
    const qrCode = await QRCode.toDataURL(redirectUrl, { margin: 2, width: 512 });

    const card = await Card.create({
      id,
      placeholder_url: redirectUrl,
      qr_code: qrCode,
      customer_url: url,
      is_sold: Boolean(url),
    });
    res.status(201).json(card);
  })
);

router.get(
  '/cards',
  handle(async (req, res) => {
    const cards = await Card.findAll({ order: [['createdAt', 'DESC']] });
    res.json(cards);
  })
);

router.get(
  '/cards/:id',
  handle(async (req, res) => {
    const card = await Card.findByPk(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    res.json(card);
  })
);

router.put(
  '/cards/:id',
  handle(async (req, res) => {
    const { url, error } = readCustomerUrl(req.body);
    if (error) return res.status(400).json({ message: error });

    const card = await Card.findByPk(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    // An empty URL un-assigns the card.
    await card.update({ customer_url: url, is_sold: Boolean(url) });
    res.json(card);
  })
);

router.delete(
  '/cards/:id',
  handle(async (req, res) => {
    const deleted = await Card.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Card not found' });
    res.status(204).end();
  })
);

// Unknown /api routes return JSON instead of the React app.
router.use((req, res) => res.status(404).json({ message: 'Not found' }));

module.exports = router;
