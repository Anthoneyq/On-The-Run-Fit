# Sets phone collection + redirect to /thanks-coaching on every Payment Link except the 5K one.
# Usage: STRIPE_SECRET_KEY=... python3 scripts/update-coaching-links.py
import os,json,urllib.request,urllib.parse,base64
K=os.environ["STRIPE_SECRET_KEY"]
def api(path,data=None):
    req=urllib.request.Request("https://api.stripe.com/v1/"+path,data=urllib.parse.urlencode(data).encode() if data else None)
    req.add_header("Authorization","Basic "+base64.b64encode((K+":").encode()).decode())
    return json.load(urllib.request.urlopen(req))
for l in api("payment_links?limit=20")["data"]:
    if l["url"].endswith("0x200"): continue
    r=api("payment_links/"+l["id"],{"after_completion[type]":"redirect","after_completion[redirect][url]":"https://ontherunfit.com/thanks-coaching","phone_number_collection[enabled]":"true"})
    print(l["url"][-5:],"phone:",r["phone_number_collection"]["enabled"],"->",r["after_completion"]["redirect"]["url"])
