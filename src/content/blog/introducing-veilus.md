---
title: "Introducing Veilus: Your First Hour, From Install to a Scheduled Script"
description: "A walkthrough of a first session with Veilus: install it, download the engine, set up a profile with a proxy, connect an AI assistant over MCP, approve its script and put it on a schedule."
pubDate: "Mar 12 2026"
updatedDate: "Oct 9 2026"
heroImage: '../../assets/blog-placeholder-3.jpg'
lang: en
translationSlug: "introducing-veilus-vi"
tags:
  - announcement
  - product
  - tutorial
---

The [homepage](https://veilus.io/) says what Veilus is. This post shows what using it looks like: one sitting, from a fresh install to a script that runs on its own every morning. Each step links to the docs page with the full details.

## 1. Install, then download the engine

Veilus runs on Windows 10 or 11 (x64) and on macOS 13 or later on Apple Silicon. Get the installer from the [download page](https://veilus.io/download/). Neither Windows nor macOS recognises the publisher on first launch, so you click through one warning: **More info → Run anyway** on Windows, **Open Anyway** in Privacy & Security on macOS. The [installation guide](https://docs.veilus.io/getting-started/installation/) has the exact steps.

The installer does not include the browser itself. Open **Settings → Engine & updates** and click **Download** next to the version marked **Latest**. That is Veilus's own build of Chromium, and every profile runs on it. The first engine you download becomes active automatically. [More about the engine](https://docs.veilus.io/engine/chromium/).

## 2. Create your first profile

Click **New profile**. Pick the operating system the profile should present. It defaults to your computer's own OS, which is the safer choice: a profile for a different OS has to imitate more, so Veilus warns you if you pick one. Then pick a market under **Language & Region**, or set the language and timezone yourself, and click **Create Profile**.

Veilus generates a [fingerprint](https://docs.veilus.io/profiles/fingerprinting/) that fits the OS you chose. Click the launch button on the profile's row, keep **Browser Only**, and a browser window opens with that profile's own fingerprint, cookies and storage.

## 3. Give it a proxy

Open the profile's panel and go to the **Network** tab. For one profile, fill in **Manual Proxy** (HTTP, SOCKS5 or residential) and click **Test Proxy**. For many profiles, create a **proxy pool** from a list and assign it. [Proxy setup](https://docs.veilus.io/profiles/proxy/) covers both.

This is the step most people trip over. By default Veilus refuses to launch a profile whose timezone doesn't match where its proxy exits, because a US IP with a Vietnam timezone contradicts itself. With a pool assigned, **Match to proxy** measures the proxy's real exit and proposes the matching timezone. With a manual proxy, set the **Timezone** yourself on the Fingerprint tab. Save, and the profile launches.

To check the result, tick the profile and click **Test**. Veilus opens it on a set of fingerprinting test sites, and the **Score** column shows how many passed.

## 4. Connect an AI assistant

Everything so far works on the Free plan, which gives you 5 profiles on one device. Automation, schedules and the local API/MCP need a paid plan or the 7-day Pro trial. See [plans and license](https://docs.veilus.io/reference/plans-and-license/).

Open **API & MCP** in the sidebar, click **Turn on port** (it listens only on your own computer), create a token, and copy the ready-made snippet for Claude Code, Cursor or Claude Desktop. The [MCP page](https://veilus.io/features/mcp/) shows how the assistant works with Veilus. If you use Claude Code, the Veilus plugin adds skills that walk through the job and stop for your decisions.

## 5. Ask for the job in one sentence

Describe the task the way you'd describe it to a colleague: "Open the first profile, go to the login page of our dashboard, write a script that logs in and prints the account name, and test it."

The assistant opens a real profile, looks at the page, writes a Playwright script and saves it to Veilus Flow. While the script is unapproved, it can trial-run it on up to 3 profiles and read back each profile's output, so it fixes its own mistakes before you look. The [LLM recipe](https://docs.veilus.io/recipes/llm-scripts/) shows each tool call along the way.

## 6. Read it, approve it

Open **Veilus Flow**. The script carries an **MCP** badge and sits under **Pending approval**. Read the changes, or the full source, then click **Approve this script**. This step exists because an approved script runs unattended with your profiles and their logins. Approval happens in the app, never through the assistant. If the assistant saves a new version later, it goes back to pending. [More on reviewing scripts](https://docs.veilus.io/automation/scripts/).

## 7. Put it on a schedule

Ask the assistant to run the approved script every day at 09:00, or create the schedule yourself in the **Schedule** tab: daily, weekly, every few minutes, a cron expression or a single run. A schedule can target a saved filter instead of a fixed list, so profiles you tag later are included automatically. [Schedules](https://docs.veilus.io/automation/schedules/).

Schedules run while Veilus is running and the computer is awake. Turn on **Run in background** in Settings, and closing the window sends Veilus to the tray instead of quitting it.

## What the assistant can't do

A few limits are built in. No tool deletes profiles, proxy pools, scripts or schedules: deleting stays in the app, with you. Values you store on profiles, such as logins, only reach scripts you've approved. And at most 16 profile browsers are open at once, counting everything, so a large run waits for a free slot instead of overloading your machine.

## Where to go next

- [Quick start in the docs](https://docs.veilus.io/getting-started/quickstart/)
- [Pricing](https://veilus.io/pricing/)
- [Telegram](https://t.me/veilusbrowser) for questions, [GitHub](https://github.com/veilus) for bug reports
