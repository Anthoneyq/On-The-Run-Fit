# Turns on the promotion-code field on every Payment Link. Usage: STRIPE_SECRET_KEY=... python3 scripts/enable-promo-codes.py
import os,json,urllib.request,urllib.parse,base64
K=os.environ["STRIPE_SECRET_KEY"]
def api(path,data=None):
    req=urllib.request.Request("https://api.stripe.com/v1/"+path,data=urllib.parse.urlencode(data).encode() if data else None)
    req.add_header("Authorization","Basic "+base64.b64encode((K+":").encode()).decode())
    return json.load(urllib.request.urlopen(req))
for l in api("payment_links?limit=20")["data"]:
    r=api("payment_links/"+l["id"],{"allow_promotion_codes":"true"})
    print(l["url"][-5:],"promo codes:",r["allow_promotion_codes"])
