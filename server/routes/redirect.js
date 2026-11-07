const express = require('express');
const Card = require('../models/Card');

const router = express.Router();

function page(title, text) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>body{font-family:system-ui,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;background:#f5f5f5;color:#333;text-align:center}main{padding:2rem;max-width:28rem}</style>
</head><body><main><h1>${title}</h1><p>${text}</p></main></body></html>`;
}

// Public: this is what a scanned QR code opens. No login and no rate limit.
// Old codes used /api/r/:id, new ones use the shorter /r/:id; both work.
async function redirect(req, res, next) {
  try {
    const card = await Card.findByPk(req.params.id);
    if (!card) {
      return res.status(404).send(page('Card not found', 'This QR code is not registered.'));
    }
    if (!card.customer_url) {
      return res
        .status(404)
        .send(page('Not activated yet', 'This card has not been linked to a website yet.'));
    }
    // Count the scan without making the visitor wait for it.
    card.increment('hits').catch((err) => console.error('Could not count hit:', err.message));
    res.redirect(302, card.customer_url);
  } catch (err) {
    next(err);
  }
}

router.get('/r/:id', redirect);
router.get('/api/r/:id', redirect);

module.exports = router;
