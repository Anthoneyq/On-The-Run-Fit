# Undo the OTRF setup on a Stripe account: deactivate our Payment Links + prices, archive our products (all reversible in the dashboard).
# Usage: STRIPE_SECRET_KEY=... python3 scripts/stripe-teardown.py
import os,json,urllib.request,urllib.parse,base64
K=os.environ["STRIPE_SECRET_KEY"]
def api(path,data=None):
    req=urllib.request.Request("https://api.stripe.com/v1/"+path,data=urllib.parse.urlencode(data).encode() if data else None)
    req.add_header("Authorization","Basic "+base64.b64encode((K+":").encode()).decode())
    return json.load(urllib.request.urlopen(req))
for l in api("payment_links?limit=50")["data"]:
    if l["active"]: print("link off  ", l["url"][-5:], api("payment_links/"+l["id"],{"active":"false"})["active"])
for p in api("products?limit=50&active=true")["data"]:
    if (p.get("metadata") or {}).get("otrf_product") not in ("5k","coaching"): print("skip (not ours)", p["name"]); continue
    for pr in api("prices?product="+p["id"]+"&active=true")["data"]:
        api("prices/"+pr["id"],{"active":"false"})
    print("archived  ", p["name"], api("products/"+p["id"],{"active":"false"})["active"])
