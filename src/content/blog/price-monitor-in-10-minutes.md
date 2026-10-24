---
title: "Track Competitor Prices in 10 Minutes with a Ready-Made Script"
description: "A step-by-step guide to monitoring prices on product pages with a tested Veilus Flow script, a dataset and a schedule, with optional alerts to Slack or Discord."
pubDate: "Oct 25 2026"
heroImage: '../../assets/hero-flow-approve.jpg'
lang: en
tags:
  - scraping
  - automation
  - guide
---

Checking prices by hand does not scale. You open ten tabs, copy numbers into a sheet, and by the time you finish the first page has changed. A quick script fixes the typing, but a bare script that fetches pages from one machine with one identity tends to get odd answers or lose its session, and then you are debugging the monitor instead of reading prices.

We published a ready-made price monitor in the public [veilus/sdk](https://github.com/veilus/sdk/tree/main/solutions/price-monitor) repo. It is one script, one CSV and a three-step setup. This post walks through it.

## How it works

The script runs inside a Veilus profile. Each run uses a real profile with its own fingerprint, proxy and cookies, so every page is opened the way a normal browser session would open it, and the same profile keeps the same identity from one run to the next.

For each row of a dataset, the script:

1. opens the URL,
2. reads the text of a CSS selector,
3. turns it into a number,
4. compares it with the number saved on the previous run.

At the end it prints one summary line, and optionally posts the changes to a webhook. Between pages it pauses for one second, so it does not hammer the site.

## Set it up in three steps

**1. Paste and approve the script.** In Veilus Flow, open Scripts, create a script and paste the contents of `script.ts`. Save it, then approve it. This step is easy to miss: a saved script only receives dataset rows after it is approved. When we ran it unapproved, it failed with "no rows".

**2. Import the dataset.** The repo ships `dataset.csv` with two columns, `URL` and `SELECTOR`, and one row per product page:

```csv
URL,SELECTOR
https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html,.product_main .price_color
https://books.toscrape.com/catalogue/tipping-the-velvet_999/index.html,.product_main .price_color
```

Import it as a dataset and assign it to the profile. The `SELECTOR` column is optional: when it is empty, the script falls back to `.price`.

**3. Run it, then schedule it.** Run the script once to check that it works, then add a schedule, for example every 6 hours.

## Read the result

Every run ends with one line starting with `RESULT`. On our first run, with nothing saved yet, the monitor only recorded prices:

```
RESULT {"checked":2,"changed":[]}
```

The first run never reports changes, because there is nothing to compare with. A second run with the same prices gives the same line.

To see the alert path, we edited the saved price of the first book to `0` and ran the script again. The monitor saw a difference and reported it:

```
RESULT {"checked":2,"changed":[{"url":"https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html","from":0,"to":51.77}]}
```

Both outputs were measured on 25 October 2026 on a real profile. The `0` was our own edit to the state file, not a real price change on the site.

### Alerts to Slack or Discord

If you add a profile variable called `WEBHOOK_URL` with a Slack or Discord webhook address, the script sends a POST with a short text listing each changed URL with its old and new price. It sends the alert before it saves the new prices, so if the webhook fails the run fails too, and the next run still sees the change. We have not exercised this path against a real webhook, so we are describing what the code does, not showing you a message.

## Make it yours

- **Your own pages.** Put your product URLs in the `URL` column.
- **Where the price is.** Right-click the price, choose Inspect, and copy a CSS selector into `SELECTOR`. Each row can have its own.
- **Where the last prices are kept.** By default in `~/veilus-solutions`; set the `OUT_DIR` profile variable to change it. State is kept per profile.
- **More than one identity.** Assign the dataset to several profiles and each keeps its own saved prices, proxy and cookies.

One limit worth knowing: the price parser treats the last `.` or `,` as the decimal point, so a value like `1,299` is read as 1.299. If a site formats prices that way, the script comment explains how to adapt it.

## Be a good citizen

Monitoring prices is only fine when you do it politely.

- Read the site's terms of service before you monitor it. Some forbid automated access.
- Check `robots.txt` and respect it.
- Go slow. Check a few times a day, not every minute, and keep the pause between pages.
- Monitor your own pages or pages you have the right to read, such as public product listings.

The example rows use books.toscrape.com, a sandbox built for scraping practice. Use it to test, then point the script at pages you are allowed to monitor.

## Links

- Script, dataset and README: [github.com/veilus/sdk/tree/main/solutions/price-monitor](https://github.com/veilus/sdk/tree/main/solutions/price-monitor)
- Step-by-step recipe in the docs: [docs.veilus.io/recipes/price-monitor](https://docs.veilus.io/recipes/price-monitor/)
