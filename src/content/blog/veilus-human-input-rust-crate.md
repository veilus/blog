---
title: "veilus-human-input: Human-Like Mouse, Wheel and Typing for Rust Automation"
description: "A new open-source Rust crate that generates mouse paths, wheel scrolls and typing rhythm for browser automation. What the models are, what we measured against a real person, and why we published the algorithm but not our parameters."
pubDate: "Oct 12 2026"
heroImage: '../../assets/hero-engine.jpg'
lang: en
translationSlug: "veilus-human-input-rust-crate-vi"
tags:
  - rust
  - open-source
  - automation
  - engineering
---

When an AI assistant clicks a button through Veilus, something has to decide where the pointer starts, which way it bends, how fast it moves and how long the button stays down. We wrote that code for Veilus's MCP `click`, `type` and `scroll` tools, and today we are publishing it as a standalone crate: [`veilus-human-input`](https://crates.io/crates/veilus-human-input), MIT or Apache-2.0, source on [GitHub](https://github.com/veilus/human-input).

It is a small library of pure functions. You give it parameters and a random number generator; it gives you back points, wheel deltas and durations. Sending them to a browser — CDP `Input.dispatchMouseEvent`, WebDriver, operating-system events — is up to you. There is no I/O and no async runtime, and a seeded RNG makes every result reproducible.

## What It Looks Like

```toml
[dependencies]
veilus-human-input = "0.1"
rand = "0.8"
```

```rust
use rand::{rngs::StdRng, SeedableRng};
use veilus_human_input::{keyboard, mouse, wheel};

let mut rng = StdRng::seed_from_u64(42);

// Mouse: from the last pointer position to a random point inside a button.
let p = mouse::MouseParams::default();
let target = mouse::pick_point((300.0, 200.0, 420.0, 240.0), &p, &mut rng);
for step in mouse::path((40.0, 40.0), target, 120.0, &p, &mut rng) {
    // send mouseMoved at (step.x, step.y), then wait step.delay
}

// Wheel: one scroll of ~1,800 px as macOS acceleration produces it.
let w = wheel::WheelParams::default();
for (delta_y, wait) in wheel::wheel_events(wheel::WheelStyle::MacAccelerated, 1_800, &w, &mut rng) {
    // send mouseWheel with deltaY = delta_y, then wait
}

// Typing: hold time and pause for each character, plus the physical key.
for (ch, t) in "Hello".chars().zip(keyboard::timings("Hello", &keyboard::TypingParams::default(), &mut rng)) {
    let key = keyboard::us_key(ch); // code "KeyH", keyCode 72, shift: true
    // keyDown, wait t.hold, keyUp, wait t.gap
}
```

## The Models

- **Mouse.** A cubic Bézier curve whose two control points sit on the same side of the straight line, so the pointer bends one way instead of wobbling, with an accelerate-then-decelerate speed profile. Movement time follows Fitts' law: far and small targets take longer. Points are spaced by a fixed polling interval, the way a real mouse reports its position. Long moves overshoot and come back in a short correction; some moves pass through a few waypoints first. The click lands at a random point inside the middle of the target, never its exact center.
- **Wheel.** `Notched` sends equal steps with pauses, like a wheel with detents. `MacAccelerated` sends one flick that ramps from a tiny first delta up to a plateau of large deltas a few milliseconds apart.
- **Typing.** The pause between keys is log-normal — mostly quick, with a long tail — longer after a space or punctuation, with occasional hesitations. Each key is held for a random time. `us_key` maps a character to its `KeyboardEvent.code`, Windows `keyCode` and Shift state on a US layout; characters that need an input method, such as accented letters, return `None`.

Every number in those models is a field of `MouseParams`, `WheelParams` or `TypingParams`.

## One Parameter Gave It Away

We recorded one person on one page — 20 clicks on targets of random size and position, three typed sentences, one long scroll — then had the crate do the same tasks in a Chromium browser. For each feature we compared the two with a Kolmogorov–Smirnov test, and we trained a cross-validated logistic-regression classifier to tell them apart. An accuracy of 0.5 means it cannot.

| Parameters | Mouse classifier | Keyboard classifier |
|---|---:|---:|
| `Default`, unchanged | 1.00 | 0.63 ± 0.08 |
| `Default`, `tick` set to the recorded mouse's report interval | 0.38 ± 0.14 | 0.59 ± 0.05 |

The first row surprised us. With the default settings the classifier told the crate from the person **every time**, and it needed only one feature to do it: the median gap between pointer events. The default `tick` is 8 ms, a 125 Hz USB mouse. The mouse we recorded reported every 11 ms. Curves, speeds and overshoots did not matter while that one number was off.

Set `tick` to the recorded device and the mouse accuracy drops to 0.38 ± 0.14: with a 20-segment sample, no mouse feature stood out from the noise. The lesson for anyone generating input: **match the device you claim to be** before tuning anything else.

The limits, stated plainly: one session of one person, on macOS, with a wheel mouse — 20 mouse segments and 142 key pairs. That says "close to this person", not "close to people". The crate makes no promise that automation goes unnoticed; it removes the most obvious machine signatures from input timing and geometry.

## Why the Algorithm Is Open and Our Parameters Are Not

The `Default` values are not the ones Veilus uses. They come from public knowledge — a 125 Hz USB mouse, Chromium's 100 px wheel step, an average typist's rhythm — and the numbers in the table above are measurements of those defaults.

Veilus passes its own parameter set into the same functions, and that set stays private. The table shows why: a single parameter was enough to separate a person from the crate perfectly. If we published the exact values Veilus uses, anyone building a detector could generate unlimited samples from them and train a model that recognises exactly Veilus. Publishing the algorithm tells them the *family* of paths; it does not tell them where in that family Veilus sits.

That split is the same one we made with [`veilus-fingerprint`](https://crates.io/crates/veilus-fingerprint), our open fingerprint generator: the general tool is public, the product's tuning stays in the product.

## Try It

```bash
cargo add veilus-human-input rand@0.8
```

The [README](https://github.com/veilus/human-input) has the full example, and the [docs page](https://docs.veilus.io/reference/human-input/) explains each parameter group. The Veilus app is moving its MCP `click`, `type` and `scroll` tools onto the crate in an upcoming release. If you tune the defaults for a device or a group of users and measure the result, we would like to hear about it — open an issue on GitHub.

---

*Want an AI assistant to drive real browser profiles? [Download Veilus free](https://veilus.io/download).*
