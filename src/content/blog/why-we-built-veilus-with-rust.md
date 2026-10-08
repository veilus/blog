---
title: "Why We Built Veilus with Rust and Tauri"
description: "The technical story behind building Veilus's desktop app with Tauri and Rust: how the app and the browser engine fit together, what Rust gives us, and what it costs."
pubDate: "Mar 11 2026"
updatedDate: "Oct 8 2026"
heroImage: '../../assets/blog-placeholder-2.jpg'
lang: en
tags:
  - rust
  - tauri
  - performance
  - engineering
---

Veilus opens many browser profiles side by side, each with its own fingerprint and proxy. The desktop app that manages them is built with Tauri 2 and Rust. This post explains why we chose that stack, how the pieces fit together, and what it costs us.

## Two Halves: The App and the Engine

Veilus has two parts that are easy to mix up:

- **The app** is what you install. It lists your profiles, edits their [fingerprints](https://docs.veilus.io/profiles/fingerprinting/) and proxies, runs [automation](https://docs.veilus.io/automation/overview/), and launches browsers. This is the part built with Tauri and Rust.
- **The engine** is the browser each profile runs in: [Veilus's own patched build of Chromium](https://docs.veilus.io/engine/chromium/). The app [downloads it separately](https://docs.veilus.io/getting-started/installation/) and starts one browser per open profile.

```
[Veilus app: Tauri 2]
  ├── [Interface in the system webview]
  └── [Rust core: profiles, fingerprints, proxies, automation]
        ├── [Profile 1: Veilus's patched Chromium]
        ├── [Profile 2: Veilus's patched Chromium]
        └── [Profile 3: Veilus's patched Chromium]
```

The engine is Chromium because websites expect a real Chrome-family browser. The app around it had no such constraint, so we could choose the stack we trusted most to stay correct.

## Why Tauri

Tauri lets us write the interface with ordinary web technology and put everything else in Rust. The interface runs in the webview the operating system already provides — WebView2 on Windows, WKWebView on macOS — so the app does not carry a second browser just to draw its own windows.

That split suits Veilus:

- **The app and the engine ship separately.** The installer does not include the browser engine; the app downloads Veilus's patched Chromium itself, so the two can be updated on their own schedules.
- **The state lives in Rust.** Profiles, schedules and scripts are kept by the Rust core, and the interface reads and changes them through it.
- **One core behind every entry point.** The local REST API and the MCP server (`veilus mcp`) ship in the same Rust program as the interface and call into the same core, so your AI assistant works with the same profiles you see in the app.

## Why Rust

### Memory Safety Without a Garbage Collector

In safe Rust, the compiler rules out use-after-free bugs and data races before the code ever runs, and it does so without a garbage collector. Veilus handles sensitive data — cookies, credentials, fingerprints — so a whole class of memory bugs that cannot reach users is a security property, not just a technical detail.

### Concurrency the Compiler Checks

Veilus does many things at once: it launches browsers, watches their processes and runs scheduled scripts across profiles. Rust's type system refuses to compile code that shares data between threads unsafely. It does not prevent every concurrency bug — deadlocks and logic races are still ours to avoid — but in safe Rust a data race is a compile error, not a crash report.

### SQLite, Directly

Profiles, schedules and scripts are stored in a local SQLite database on your machine. The `rusqlite` crate gives the Rust core direct access to it, with no ORM layer in between.

## The Trade-offs

Being honest about the downsides:

1. **Fewer ready-made parts.** Tauri's ecosystem is still young, so we write more pieces ourselves.
2. **Steeper learning curve.** Rust asks more of whoever writes it, and experienced Rust developers are harder to find.
3. **Slower iteration.** The compiler is strict, so a change that would be quick in JavaScript can take noticeably longer to get past it. In return, many of the bugs it stops would otherwise have shown up in production.
4. **Two webviews to test.** Tauri draws the interface with the operating system's webview, and those behave slightly differently from one system to the next. Veilus ships for Windows and macOS, so the interface has to hold up in both.

## Was It Worth It?

For us, yes. The compiler checks what we would otherwise have to remember, the interface stays ordinary web code, and the browser your profiles run in is still Chromium — patched by us, because that is what websites expect. We'll keep writing about what we learn as Veilus grows.

---

*Want to see it for yourself? [Download Veilus free](https://veilus.io/download) — built with Rust, run with confidence.*
