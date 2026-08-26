#!/usr/bin/env python3
"""Lindsey's 2026-08-26 pricing: Online Coaching $120/mo, In-Person $450/mo, Strength add-on +$50/mo (optional item at checkout).
Deletes the old ladder (Coached $149, Race Ready $279, All-In $897, All-In cont. $199, In-Person $547): deactivates those
Payment Links and archives their products/prices. Leaves 5K ($39) and Teams & Schools ($1,197) untouched.
Idempotent — safe to re-run. Also writes the two new URLs into assets/checkout.js.

Run from the Website folder with the "OTRF website" restricted key (Products/Prices/Payment Links write):
  vercel env pull --environment=production --yes /tmp/otrf.env && set -a && source /tmp/otrf.env && set +a \
  && python3 scripts/reprice-2026-08-26.py && rm /tmp/otrf.env
"""
import os, re, json, urllib.request, urllib.parse, base64, sys
K = os.environ["STRIPE_SECRET_KEY"]
def api(path, data=None):
    req = urllib.request.Request("https://api.stripe.com/v1/" + path, data=urllib.parse.urlencode(data).encode() if data is not None else None)
    req.add_header("Authorization", "Basic " + base64.b64encode((K + ":").encode()).decode())
    try:
        return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e:
        raise SystemExit(f"Stripe {e.code} on {path}: {e.read().decode()[:400]}")

def product(name, plan):
    for p in api("products?active=true&limit=100")["data"]:
        if p["name"] == name: return p["id"]
    return api("products", {"name": name, "metadata[otrf_product]": "coaching", "metadata[otrf_plan]": plan})["id"]
def price(pid, cents):
    for p in api(f"prices?product={pid}&active=true&limit=20")["data"]:
        if p["unit_amount"] == cents and (p.get("recurring") or {}).get("interval") == "month": return p["id"]
    return api("prices", {"product": pid, "unit_amount": cents, "currency": "usd", "recurring[interval]": "month"})["id"]

links = api("payment_links?limit=100")["data"]
def link(plan, main_price, addon_price):
    for l in links:
        if l["active"] and (l.get("metadata") or {}).get("otrf_plan") == plan: return l["url"]
    d = {"line_items[0][price]": main_price, "line_items[0][quantity]": 1,
         "optional_items[0][price]": addon_price, "optional_items[0][quantity]": 1,
         "phone_number_collection[enabled]": "true", "allow_promotion_codes": "true",
         "after_completion[type]": "redirect", "after_completion[redirect][url]": "https://ontherunfit.com/thanks-coaching",
         "metadata[otrf_product]": "coaching", "metadata[otrf_plan]": plan}
    return api("payment_links", d)["url"]

strength = price(product("Strength Add-On — monthly", "strength"), 5000)
coached  = link("coached",  price(product("Online Coaching — monthly", "coached"), 12000), strength)
inperson = link("inPerson", price(product("In-Person Coaching — monthly", "inPerson"), 45000), strength)
print("Online Coaching  $120/mo (+$50 strength optional):", coached)
print("In-Person        $450/mo (+$50 strength optional):", inperson)

# retire the old ladder
OLD = {14900, 27900, 89700, 19900, 54700}
for l in links:
    if not l["active"] or (l.get("metadata") or {}).get("otrf_plan"): continue
    items = api(f"payment_links/{l['id']}/line_items")["data"]
    amts = {i["price"]["unit_amount"] for i in items}
    if amts & OLD:
        api(f"payment_links/{l['id']}", {"active": "false"})
        for i in items:
            api(f"prices/{i['price']['id']}", {"active": "false"})
            api(f"products/{i['price']['product']}", {"active": "false"})
        print("retired link", l["url"][-5:], sorted(amts))

# write the site
p = "assets/checkout.js"; s = open(p).read()
s = re.sub(r'coached: "[^"]*"', f'coached: "{coached}"', s)
s = re.sub(r'inPerson: "[^"]*"', f'inPerson: "{inperson}"', s)
open(p, "w").write(s)
print("assets/checkout.js updated — now: git commit -am 'Wire $120/$450 Payment Links' && git push")
