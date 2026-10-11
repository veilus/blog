---
title: "Connect Claude Code to an Anti-Detect Browser over MCP: Setup, Tools and Guardrails"
description: "How to connect Claude Code, Cursor or Claude Desktop to Veilus over MCP, what the 39 tools let an AI assistant do with your browser profiles, and the limits that keep it from acting without you."
pubDate: "Oct 11 2026"
heroImage: '../../assets/hero-mcp-demo.jpg'
lang: en
tags:
  - mcp
  - tutorial
  - automation
---

Veilus runs many browser profiles on one computer, each with its own fingerprint, cookies and proxy. It also ships an MCP server, so an AI assistant such as Claude Code can create those profiles, open them, read their pages, write a Playwright script and put it on a schedule. This post covers the setup, what the assistant can and can't do, and why a few things always stay with you.

[Watch the 55-second demo on YouTube](https://www.youtube.com/watch?v=8NRDNW_4KNU): one sentence in Claude Code, three profiles, a script tested on all three, one approval, then a daily schedule.

## What you need

- Veilus on Windows 10/11 (x64) or macOS on Apple Silicon, from the [download page](https://veilus.io/download/), with the engine downloaded under **Settings → Engine & updates**.
- A paid plan or the 7-day Pro trial. The Free plan (5 profiles on one device) does not include the local API and MCP. See [plans and license](https://docs.veilus.io/reference/plans-and-license/).
- An MCP client: Claude Code, Cursor or Claude Desktop.

## Step 1: Turn on the local API

Open **API & MCP** in the app sidebar and click **Turn on port**. The port listens only on your own computer. On the same page, create a token. Every MCP call carries it, so treat it like a password.

## Step 2: Connect your client

The Veilus app binary has an `mcp` subcommand that speaks MCP over stdio. The **API & MCP** page shows a ready-made snippet with the real binary path and your token filled in, so copy it from there. For Claude Code it looks like this:

```bash
claude mcp add --scope user veilus -e VEILUS_API_TOKEN=<token> -- "<path to Veilus>" mcp
```

`--scope user` makes Veilus available in every folder you open Claude Code in. For Cursor or Claude Desktop, the snippet goes into the client's MCP config:

```json
{
  "mcpServers": {
    "veilus": {
      "command": "<path to Veilus>",
      "args": ["mcp"],
      "env": { "VEILUS_API_TOKEN": "<token>" }
    }
  }
}
```

## Step 3 (Claude Code): add the plugin

Any MCP client can use the tools directly. If you use Claude Code, the Veilus plugin adds four skills that walk through a job step by step and stop at the points where you decide:

```bash
claude plugin marketplace add veilus/claude-plugin
claude plugin install veilus@veilus
```

Restart Claude Code and type `/veilus:` to see them: `campaign` for the whole job, `script` to write and test a script, `schedule` to plan a schedule and show it to you as a table before creating it, and `run` to run a script now and explain any failures profile by profile. The plugin is [open source on GitHub](https://github.com/veilus/claude-plugin).

## What the assistant can do

As of October 2026 the server has 39 tools. The [MCP reference](https://docs.veilus.io/reference/mcp/) lists every one with its parameters. They fall into five groups:

| Group | Tools | What they cover |
|---|---|---|
| Profiles and proxies | 10 | Create up to 50 profiles in one call, launch and stop them, import proxy lists into a pool, test proxies, assign a pool |
| The page | 9 | Load a URL in a running profile, read the page as an accessibility snapshot, click and type with real mouse and key events, scroll, wait for an element, attach a file |
| Scripts | 6 | Save a Playwright script into Veilus Flow, read it back, trial-run it and read each profile's output |
| Runs and schedules | 7 | Run an approved script on many profiles, schedule it, turn schedules on or off, list runs, check how many browsers this computer can run at once |
| Datasets | 7 | Tables of per-profile input, such as one account row per profile, that approved scripts read |

The page tools act inside a profile that is already running, with its own fingerprint and logins. The assistant does not start a separate browser of its own.

## A first request

Describe the job the way you would describe it to a colleague. This is the request from the demo:

```
Create 3 Veilus profiles named "Demo {n}". Then write a script that opens
https://quotes.toscrape.com/ and prints the first quote and its author.
Test it on those 3 profiles.
```

The assistant calls `create_profiles`, opens one profile, uses `navigate` and `snapshot` to learn the page, and saves a script with `save_script`. Then it trial-runs the script with `run_script` on the three profiles and reads each one's output with `get_run_result`. If a run fails, it reads the error, fixes the script and saves it again, all before you've looked at anything.

Scripts follow a fixed contract: they connect to the profile's own browser over CDP instead of launching one, and leave the user agent and viewport alone because those belong to the profile. The [LLM scripts recipe](https://docs.veilus.io/recipes/llm-scripts/) has the full rules and a minimal correct script.

## Approval stays in the app

A script saved by an assistant is **not approved**. It can be trial-run on up to 3 profiles, but batch runs and schedules accept only approved scripts. To approve it, open **Veilus Flow**, where the script carries an **MCP** badge under **Pending approval**, read the changes or the full source, and click **Approve this script**.

There is no tool for approving. An approved script runs unattended with your profiles and their logins, and it is a normal Node program with your user's permissions, so it gets the review you'd give a pull request. If the assistant saves a new version later, it goes back to pending.

After that, a second sentence is enough: "I approved it. Schedule it for those 3 profiles every day at 9:00."

## Other limits on the assistant

- **It can create and stop, never delete.** No tool deletes profiles, proxy pools, scripts or schedules. The assistant can turn a schedule off, which keeps the schedule and its history.
- **Existing proxies aren't overwritten by accident.** Assigning a pool refuses the whole call if any profile already has a proxy, unless the assistant explicitly forces it.
- **Expensive calls are rate-limited.** Each token can make at most 30 launches, runs, profile creations or proxy imports per 60 seconds.
- **Stored secrets reach only approved scripts.** Profile variables and dataset rows go to approved scripts. A trial run of an unapproved script sees only what was passed to that one call.
- **`evaluate_js` is not a sandbox.** It runs JavaScript in a logged-in page with that page's rights. Only let an assistant you trust use it on accounts that matter.

Schedules run while Veilus is running and the computer is awake. Turn on **Run in background** in Settings so closing the window sends Veilus to the tray instead of quitting it.

## Try it

[Download Veilus](https://veilus.io/download/), start the 7-day Pro trial in the app, and connect your assistant from the **API & MCP** page. The [MCP page](https://veilus.io/features/mcp/) has the overview, and the [first-hour walkthrough](/blog/introducing-veilus/) covers profiles and proxies if you're new to Veilus.

Use Veilus only for accounts you own or manage with permission. See the [Acceptable Use Policy](https://veilus.io/acceptable-use/).
