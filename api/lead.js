const ALLOWED_ORIGINS = new Set([
  "https://ontherunfit.com",
  "https://www.ontherunfit.com",
  "https://on-the-run-fit.vercel.app",
  "http://localhost:8097",
  "http://127.0.0.1:8097",
]);

function setCors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
}

async function readJson(req) {
  if (req.body) {
    if (typeof req.body === "string") return JSON.parse(req.body || "{}");
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function leadText(lead) {
  return [
    `Name: ${lead.first_name} ${lead.last_name}`,
    `Email: ${lead.email}`,
    `Event: ${lead.event}`,
    `Plan: ${lead.plan_interest}`,
    "",
    `Goals: ${lead.goals}`,
    "",
    `Other: ${lead.extra || "(none)"}`,
  ].join("\n");
}

function leadHtml(lead) {
  const rows = [
    ["Name", `${lead.first_name} ${lead.last_name}`],
    ["Email", lead.email],
    ["Event", lead.event],
    ["Plan", lead.plan_interest],
    ["Goals", lead.goals],
    ["Other", lead.extra || "(none)"],
  ];

  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#2A2320">
      <h1 style="font-family:Georgia,serif;color:#B22A58">New On The Run Fit Application</h1>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:680px">
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th align="left" valign="top" style="border-top:1px solid #ECE0D6;width:140px">${escapeHtml(label)}</th>
                <td style="border-top:1px solid #ECE0D6">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
              </tr>`
          )
          .join("")}
      </table>
    </div>`;
}

module.exports = async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "Method not allowed" });
    return;
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    res.status(400).json({ ok: false, error: "Invalid JSON" });
    return;
  }

  if (clean(body._gotcha)) {
    res.status(204).end();
    return;
  }

  const lead = {
    first_name: clean(body.first_name),
    last_name: clean(body.last_name),
    email: clean(body.email).toLowerCase(),
    event: clean(body.event),
    plan_interest: clean(body.plan_interest),
    goals: clean(body.goals),
    extra: clean(body.extra),
  };

  const missing = Object.entries(lead)
    .filter(([key, value]) => key !== "extra" && !value)
    .map(([key]) => key);

  if (missing.length || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    res.status(400).json({ ok: false, error: "Missing or invalid fields", missing });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL || "ontherunfit@gmail.com";
  const from = process.env.LEAD_FROM_EMAIL || "On The Run Fit <leads@ontherunfit.com>";

  if (!apiKey) {
    res.status(503).json({ ok: false, error: "Lead email service is not configured" });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.email,
      subject: `On The Run Fit application - ${lead.first_name} ${lead.last_name}`,
      text: leadText(lead),
      html: leadHtml(lead),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    res.status(502).json({ ok: false, error: "Resend send failed", detail });
    return;
  }

  res.status(200).json({ ok: true });
};
