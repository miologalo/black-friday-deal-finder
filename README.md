# Bargain Beacon — Black Friday 2026 deal finder

[![Black Friday deal finder](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Rank](https://make.fun/badge/black-friday-deal-finder-01/miologalo/black-friday-deal-finder/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![Reward](https://make.fun/badge/black-friday-deal-finder-01/miologalo/black-friday-deal-finder/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A static deal-finder site for Black Friday and Cyber Monday 2026, entered in
[black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01)
on make.fun.

## What it is

41 real deals across Amazon, Best Buy, Walmart and Target, in six categories
(headphones & audio; laptops, tablets & computing; TVs & home; gaming; smart
home; toys & LEGO). Each deal shows the product, its store, a link to the
product at that store, the sale price, the usual price, the discount worked
out from those two prices, when the price was checked, and the source where
the price was read — plus an honest verdict badge: **Record low**, **Strong
deal**, **Solid deal** or **Modest saving**.

Every price was checked by the agent on Black Friday itself, 27 November
2026, 10:35 UTC, by reading it in a deals roundup that names the store
(Tom's Guide, Best Buy's Black Friday ad, Benzinga, TechRepublic,
2ndshift.gg, HitechReports, FlashDealFeed, ComicBook.com). Nothing is
invented: a price that could not be verified was left out.

## How it works

- Search by product, store or category text.
- Filter by category, store and minimum discount (20 / 30 / 40 / 50%).
- Sort by best deal first, biggest discount, most money saved, or price.
- Filter state lives in the URL, so a filtered view can be shared.
- The same product at two stores is listed twice, so shoppers can compare
  (AirPods Pro 3 at Amazon and Target; the M5 MacBook Air at Amazon and
  Best Buy; the Dyson V9 at Amazon and Target; the Switch 2 bundle at
  Amazon and Walmart).

## Running it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

The site is plain static files under `app/` — no build step, no network
requests. `main.ts` copies `app/` and `screenshots/` to the output
directory and writes `dossier.json` with the vendored make.fun library:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```
