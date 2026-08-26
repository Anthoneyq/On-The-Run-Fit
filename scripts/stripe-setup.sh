#!/usr/bin/env bash
# One-time Stripe setup for On The Run Fit. Run with LINDSEY'S key:
#   STRIPE_SECRET_KEY=sk_live_... bash scripts/stripe-setup.sh
# Creates the 5K product + Payment Link (redirects to thanks-5k) and Payment Links Lindsey can send after coaching calls.
set -euo pipefail
: "${STRIPE_SECRET_KEY:?set STRIPE_SECRET_KEY to the Stripe restricted key}"
api(){ curl -s -u "$STRIPE_SECRET_KEY:" "https://api.stripe.com/v1/$1" "${@:2}"; }
id(){ python3 -c 'import sys,json;d=json.load(sys.stdin);print(d.get("id") or d)'; }
url(){ python3 -c 'import sys,json;d=json.load(sys.stdin);print(d.get("url") or d)'; }
# idempotent: reuse an existing active product with this exact name, else create
product(){ # name [extra -d args...] — reuse an existing ACTIVE product with this exact name (list, not search: search index lags)
  local found
  found=$(api "products?active=true&limit=100" | python3 -c 'import sys,json;n=sys.argv[1];print(next((p["id"] for p in json.load(sys.stdin).get("data",[]) if p["name"]==n),""))' "$1")
  if [ -n "$found" ]; then echo "$found"; else api products --data-urlencode "name=$1" "${@:2}" | id; fi
}
# idempotent: reuse an existing active price on the product with the same amount (+interval), else create
price(){ # product amount_cents interval("" = one-time) [extra -d args...]
  local found
  found=$(api "prices?product=$1&active=true&limit=20" | python3 -c '
import sys,json;amt=int(sys.argv[1]);iv=sys.argv[2]
for p in json.load(sys.stdin).get("data",[]):
    if p["unit_amount"]==amt and ((p.get("recurring") or {}).get("interval") or "")==iv: print(p["id"]);break' "$2" "$3")
  if [ -n "$found" ]; then echo "$found"; return; fi
  if [ -n "$3" ]; then api prices -d product="$1" -d unit_amount="$2" -d currency=usd -d "recurring[interval]=$3" "${@:4}" | id
  else api prices -d product="$1" -d unit_amount="$2" -d currency=usd "${@:4}" | id; fi
}

echo "== 12-Week 5K Programs (USD 39, one-time)"
P5K=$(product "12-Week 5K Programs" --data-urlencode "description=Beginner, Intermediate and Advanced 12-week 5K plans + Pace Groups & Terms guide (PDF)" -d "metadata[otrf_product]=5k")
PR5K=$(price "$P5K" 3900 "" -d "metadata[otrf_product]=5k")
L5K=$(api payment_links -d "line_items[0][price]=$PR5K" -d "line_items[0][quantity]=1" \
  -d "after_completion[type]=redirect" \
  -d "after_completion[redirect][url]=https://ontherunfit.com/thanks-5k?session_id={CHECKOUT_SESSION_ID}" \
  -d "metadata[otrf_product]=5k" | url)
echo "5K price id:      $PR5K"
echo "5K payment link:  $L5K"

mk(){ # name amount_cents interval("" for one-time)
  local pid pr link
  pid=$(product "$1" -d "metadata[otrf_product]=coaching")
  pr=$(price "$pid" "$2" "$3")
  link=$(api payment_links -d "line_items[0][price]=$pr" -d "line_items[0][quantity]=1" -d "after_completion[type]=hosted_confirmation" \
    --data-urlencode "after_completion[hosted_confirmation][custom_message]=You're in! Lindsey will reach out to get your plan started." | url)
  printf "%-32s %s\n" "$1" "$link"
}
echo; echo "== Coaching Payment Links (Lindsey sends these after the call)"
mk "Coached — monthly coaching" 14900 month
mk "Race Ready — monthly coaching" 27900 month
mk "All-In: 90-Day Goal Build" 89700 ""
mk "All-In continuation — monthly" 19900 month
mk "In-Person Coaching — monthly" 54700 month
mk "Teams & Schools — season" 119700 ""
echo; echo "NEXT: put the 5K payment link in assets/checkout.js (fiveK), then:"
echo "  vercel env add STRIPE_SECRET_KEY production   (the RESTRICTED key: Checkout Sessions read)"
echo "  vercel env add STRIPE_5K_PRICE_ID production  → $PR5K"
