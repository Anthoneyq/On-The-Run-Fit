// POST /api/onboarding — new-client questionnaire (after coaching purchase) → emails Lindsey via Resend.
const FIELDS = [
  ["name", "Full name", true],
  ["email", "Email", true],
  ["phone", "Phone", true],
  ["age", "Age", true],
  ["contact_pref", "Best way / time to reach you", false],
  ["plan", "Plan purchased", false],
  ["goals", "Goals", true],
  ["goal_race", "Goal race + date", false],
  ["schedule", "Racing schedule this year", false],
  ["days_per_week", "Days running per week right now", true],
  ["current_week", "Typical week right now", true],
  ["season_week", "In-season week (if you race a season)", false],
  ["strength", "Strength / mobility work now", false],
  ["time_available", "Time available per run", false],
  ["years_running", "How long running", true],
  ["comfortable", "Comfortable distance + pace", true],
  ["longest_run", "Longest recent run", true],
  ["race_times", "Current race times / PRs", false],
  ["injuries", "Current or previous injuries", true],
  ["medical", "Medical conditions / doctor restrictions", true],
  ["best_days", "Best days + definite off day", true],
  ["track", "Track access + speed-work experience", true],
  ["tracking", "How runs are tracked", true],
  ["extra", "Anything else", false],
];
const ALLOWED = new Set(["https://ontherunfit.com","https://www.ontherunfit.com","https://on-the-run-fit.vercel.app"]);
const clean = (v) => String(v || "").trim().slice(0, 4000);
const esc = (v) => clean(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
async function readJson(req){ if(req.body) return typeof req.body==="string"?JSON.parse(req.body||"{}"):req.body; const c=[]; for await (const ch of req) c.push(Buffer.from(ch)); const raw=Buffer.concat(c).toString("utf8"); return raw?JSON.parse(raw):{}; }

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED.has(origin)) { res.setHeader("Access-Control-Allow-Origin", origin); res.setHeader("Vary", "Origin"); }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });
  let body; try { body = await readJson(req); } catch { return res.status(400).json({ ok: false, error: "Invalid JSON" }); }
  if (clean(body._gotcha)) return res.status(204).end();

  const data = {}; for (const [k] of FIELDS) data[k] = clean(body[k]);
  data.email = data.email.toLowerCase();
  const missing = FIELDS.filter(([k,,req]) => req && !data[k]).map(([k]) => k);
  if (missing.length || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return res.status(400).json({ ok: false, error: "Missing or invalid fields", missing });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL || "ontherunfit@gmail.com";
  const from = process.env.LEAD_FROM_EMAIL || "On The Run Fit <leads@ontherunfit.com>";
  if (!apiKey) return res.status(503).json({ ok: false, error: "Email service not configured" });

  const text = FIELDS.map(([k, label]) => `${label}:\n${data[k] || "(blank)"}`).join("\n\n");
  const rows = FIELDS.map(([k, label]) => {
    const v = k === "email" ? `<a href="mailto:${esc(data.email)}" style="color:#B22A58">${esc(data.email)}</a>` : esc(data[k] || "(blank)").replace(/\n/g, "<br>");
    return `<tr><th align="left" valign="top" style="border-top:1px solid #ECE0D6;width:200px;padding:8px">${esc(label)}</th><td style="border-top:1px solid #ECE0D6;padding:8px">${v}</td></tr>`;
  }).join("");
  const html = `<div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#2A2320"><h1 style="font-family:Georgia,serif;color:#B22A58">New client onboarding — ${esc(data.name)}</h1><table cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px">${rows}</table></div>`;

  const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject: `New client onboarding — ${data.name}${data.plan ? " (" + data.plan + ")" : ""}`, text, html }) });
  if (!r.ok) return res.status(502).json({ ok: false, error: "Send failed", detail: await r.text() });
  res.status(200).json({ ok: true });
};
