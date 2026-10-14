---
title: "Run Your Agent Framework on a Veilus Profile"
description: "Point a Python script or a browser-use agent at a Veilus profile with the veilus SDK, so it runs with that profile's fingerprint, proxy and cookies. Ten tools tested on a real profile, and the limits."
pubDate: "Oct 14 2026"
heroImage: '../../assets/hero-engine.jpg'
lang: en
translationSlug: "veilus-sdk-agent-frameworks-vi"
tags:
  - sdk
  - python
  - automation
  - ai-agents
---

An agent script usually launches its own throwaway browser. That browser has no history, no cookies and no stable identity, and every run starts from nothing. If the agent works on an account, a shop or a research task that should look like the same user coming back, it needs a browser with an identity of its own.

A Veilus profile is that browser: it has its own fingerprint, proxy and cookies. The `veilus` SDK launches a profile and hands your script its address, so the tools you already use run inside the profile instead of beside it.

## Connect a profile

You need the Veilus desktop app 0.2.9 or newer, running, with the local API turned on (the **API & MCP** page in the sidebar, Pro plan or higher). Create a token on that page and put it in the environment:

```bash
pip install "veilus[playwright]"
export VEILUS_API_TOKEN=...
```

```python
import asyncio
from veilus import Veilus


async def main():
    veilus = Veilus()
    profiles = await veilus.list_profiles()

    session = await veilus.connect(profiles[0]["id"])
    await session.page.goto("https://example.com")
    print(await session.page.title())
    await session.close()  # disconnects Playwright; the profile keeps running

    await veilus.stop(profiles[0]["id"])


asyncio.run(main())
```

`connect()` reuses the profile if it is already running, otherwise launches it. It returns the profile's own context and page. Don't create a new context with your own user agent, viewport or locale: those would override the profile's values for that context.

The SDK reads the token only from your code or `VEILUS_API_TOKEN`. The profile's CDP address has no password, so any local program can use it while the profile runs; it listens on `127.0.0.1` only.

## A browser-use agent on a profile

Tools that attach to a running Chromium need only the profile's CDP address. `launch()` returns it as `cdpUrl`. Here a browser-use agent, driven by a Claude model, opens a page on the profile and reports its title:

```python
import asyncio
import os

from browser_use import Agent, Browser
from browser_use.llm import ChatAnthropic
from veilus import Veilus

URL = "https://example.com"


async def main() -> None:
    veilus = Veilus()
    profile = (await veilus.list_profiles())[0]
    cdp_url = profile.get("cdpUrl") or (await veilus.launch(profile["id"]))["cdpUrl"]

    # keep_alive: leave the profile running; no_viewport: never resize its tabs.
    browser = Browser(
        cdp_url=cdp_url, keep_alive=True, headless=False, no_viewport=True
    )
    # browser-use forces tool_choice; claude-haiku-5-5 accepts that, while
    # claude-sonnet-5-5 and claude-opus-5-5 answer HTTP 400.
    llm = ChatAnthropic(
        model=os.environ.get("VEILUS_EXAMPLE_MODEL", "claude-haiku-5-5")
    )
    agent = Agent(
        task=f"Open {URL}. Reply with the exact page title only, no quotes or punctuation.",
        llm=llm,
        browser=browser,
    )
    history = await agent.run(max_steps=5)
    print((history.final_result() or "").strip().strip("\"'."))


asyncio.run(main())
```

Set `ANTHROPIC_API_KEY` for the model. `keep_alive=True` stops browser-use from closing the profile's browser when the agent finishes. The `cdpUrl` changes every time the profile starts, so read it after each launch.

## Tools tested on a real profile

On October 14, 2026, we ran one example for each of these tools against a Veilus profile on macOS. Each opened a page, read its title and left the profile running. All ten passed:

| Tool | Version tested |
|---|---|
| Playwright | playwright-core 1.64.0 |
| Puppeteer | puppeteer-core 25.13.0 |
| playwright-mcp | @playwright/mcp 0.0.83 |
| agent-browser | agent-browser 0.39.1 |
| Crawl4AI | crawl4ai 0.9.4 |
| LangChain | langchain-community 0.4.2 |
| Scrapling | scrapling 0.4.6 |
| Crawlee | crawlee 1.10.4 |
| browser-use | browser-use 0.13.11 |
| Stagehand | @browserbasehq/stagehand 3.7.3 |

The examples and the table, with versions and date, are in [examples/TESTED.md](https://github.com/veilus/sdk/blob/main/examples/TESTED.md). A newer release of a tool may change behavior; the table says what was run, not what will run. Per-tool notes are in the [Use a Profile from Other Tools](https://docs.veilus.io/recipes/agent-frameworks/) recipe.

## Human-like mouse and typing

Scripts you write with Playwright control the mouse and keyboard themselves. If you want human-like pointer paths, wheel scrolls and typing rhythm in your own automation, we published models derived from the code behind Veilus's click, type and scroll tools as an open-source Rust crate, [`veilus-human-input`](https://crates.io/crates/veilus-human-input) (MIT or Apache-2.0). Every function is pure: it takes parameters and a random number generator and returns points, wheel deltas and durations, and sending them to a browser is up to you.

We compared the crate's defaults with one person on one page: 20 clicks, three typed sentences and one long scroll. With the defaults unchanged, a cross-validated classifier separated the mouse every time (1.00; 0.5 means it cannot tell the two apart). After setting `tick`, the interval between pointer events, to the recorded mouse's report interval, the mouse score was 0.38 ± 0.14 and the keyboard score 0.59 ± 0.05. That is one session of one person on macOS with a wheel mouse, so read it as "close to this person", not "close to people". Set `tick` to the device you are modelling first. The details are on the [docs page](https://docs.veilus.io/reference/human-input/) and in the [crate announcement](/blog/veilus-human-input-rust-crate/).

## What this does not do

A connected tool is still a connected tool. Veilus keeps the profile's identity; it can't hide that an automation client is driving the page while one is attached. The SDK gives your agent a browser with a consistent identity to work in. It does not change what the agent does there, and it does not decide how a site treats the traffic.
