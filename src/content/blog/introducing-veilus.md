---
title: "Introducing Veilus: An Open-Source Anti-Detect Browser"
description: "Meet Veilus — a Chromium-based anti-detect browser that modifies fingerprints at the engine level, not through detectable JavaScript injection. 100% open source."
pubDate: "2026-03-12"
lang: "en"
tags: ["announcement", "veilus"]
---

## The Problem With Browser Fingerprinting

If you've ever managed multiple online accounts, you know the struggle. Websites track your browser fingerprint — a unique combination of your screen resolution, installed fonts, WebGL renderer, canvas hash, and dozens of other signals — to identify you across sessions.

The result? Even with VPNs and proxy servers, your browser gives you away.

## The Current Landscape

Existing anti-detect solutions approach this problem with **JavaScript injection**: they run scripts that intercept browser API calls and return spoofed values. Tools like Multilogin, GoLogin, and AdsPower all use this technique.

It works — until it doesn't.

The fundamental weakness? **JS injection is detectable.** Websites can detect the injection itself, check for inconsistencies between spoofed and real values, or use timing attacks to expose the interception layer. It's an arms race where defenders have the advantage.

And these tools are **expensive** and **closed-source**. You're trusting proprietary code with your security without being able to verify what it actually does.

## Veilus: A Different Approach

Veilus takes a fundamentally different approach. Instead of patching browser APIs with JavaScript after the page loads, we **modify the Chromium source code itself**.

This means:

- **Native fingerprint management** — Modified at the C++ engine level, not JavaScript
- **No injection artifacts** — There's no script to detect because values come from the engine itself
- **Consistent fingerprints** — No mismatches between different API layers
- **Better performance** — No overhead from intercepting every API call

| Approach | Detection Risk | Performance | Transparency |
|----------|---------------|-------------|--------------|
| JS Injection (GoLogin, Multilogin) | Higher — injection detectable | Slower — API interception overhead | Closed source |
| Veilus (Chromium-level) | Lower — native engine values | Faster — no interception layer | 100% open source |

## 100% Open Source

This is where Veilus truly stands apart. **Every line of code is open and auditable.** No other anti-detect browser offers this level of transparency.

We believe that privacy tools should be verifiable. You shouldn't have to trust a company's marketing — you should be able to read the code yourself.

Our entire codebase is available on [GitHub](https://github.com/nicholasgriffintn/veilus), including:
- The Chromium patches that modify fingerprint-related APIs
- The profile management system
- Build scripts and documentation

## What's Next

We're in active development. The core engine modifications are underway, and we're building toward a first release that includes:

- Canvas and WebGL fingerprint management
- Navigator and screen API modifications
- Multi-profile isolation
- Proxy integration per profile

## Join the Community

Veilus is built in the open, and we'd love your involvement:

- ⭐ **Star us on [GitHub](https://github.com/nicholasgriffintn/veilus)** — Follow development and contribute
- 💬 **Join our [Telegram group](https://t.me/veilusbrowser)** — Chat with the team and community
- 🐦 **Follow us on [X](https://x.com/veilusbrowser)** — Stay updated on releases and news
- 📖 **Read the [docs](https://docs.veilus.io)** — Explore the architecture and contribute

Whether you're a developer interested in Chromium internals, a researcher studying fingerprinting, or someone who just wants a better privacy tool — there's a place for you in the Veilus community.

Let's build something transparent together.
