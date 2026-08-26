// GET /api/download?session_id=cs_...&file=beginner|intermediate|advanced|pace-groups
// Verifies the Stripe Checkout Session is paid and was for the 5K program, then streams the PDF.
const fs = require("fs");
const path = require("path");

const FILES = {
  "beginner": { path: "beginner.pdf", name: "12-Week 5K Program - Beginner.pdf" },
  "intermediate": { path: "intermediate.pdf", name: "12-Week 5K Program - Intermediate.pdf" },
  "advanced": { path: "advanced.pdf", name: "12-Week 5K Program - Advanced.pdf" },
  "pace-groups": { path: "pace-groups.pdf", name: "5K Program - Pace Groups and Terms.pdf" },
};

async function verifySession(sessionId) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return { ok: false, reason: "STRIPE_SECRET_KEY not configured" };
  const r = await fetch(
    "https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId) + "?expand[]=line_items",
    { headers: { Authorization: "Bearer " + key } }
  );
  if (!r.ok) return { ok: false, reason: "Session not found" };
  const s = await r.json();
  if (s.payment_status !== "paid") return { ok: false, reason: "Payment not completed" };
  const items = (s.line_items && s.line_items.data) || [];
  const wantedPrice = process.env.STRIPE_5K_PRICE_ID;
  const match = items.some((li) => {
    const price = li.price || {};
    if (wantedPrice && price.id === wantedPrice) return true;
    const product = price.product;
    const meta = (product && product.metadata) || {};
    return meta.otrf_product === "5k" || (price.metadata || {}).otrf_product === "5k";
  });
  if (!match && !wantedPrice) return { ok: false, reason: "Not a 5K program purchase" };
  if (!match) return { ok: false, reason: "Not a 5K program purchase" };
  return { ok: true, email: (s.customer_details && s.customer_details.email) || "" };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") { res.statusCode = 405; return res.end("Method not allowed"); }
  const url = new URL(req.url, "https://ontherunfit.com");
  const sessionId = url.searchParams.get("session_id") || "";
  const fileKey = url.searchParams.get("file") || "";
  const file = FILES[fileKey];
  if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId) || !file) {
    res.statusCode = 400; return res.end("Bad request");
  }
  let v;
  try { v = await verifySession(sessionId); }
  catch (e) { res.statusCode = 502; return res.end("Could not verify purchase"); }
  if (!v.ok) { res.statusCode = 403; return res.end(v.reason); }

  const abs = path.join(__dirname, "_products", "5k", file.path);
  let buf;
  try { buf = fs.readFileSync(abs); }
  catch (e) { res.statusCode = 500; return res.end("File missing"); }
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Length", String(buf.length));
  res.setHeader("Content-Disposition", 'attachment; filename="' + file.name + '"');
  res.setHeader("Cache-Control", "private, no-store");
  res.end(buf);
};
