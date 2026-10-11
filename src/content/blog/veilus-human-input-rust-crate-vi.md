---
title: "veilus-human-input: chuột, con lăn và nhịp gõ giống người cho tự động hoá bằng Rust"
description: "Crate Rust mã nguồn mở mới, sinh đường đi chuột, cú cuộn con lăn và nhịp gõ phím cho tự động hoá trình duyệt. Các mô hình là gì, chúng tôi đo được gì khi so với một người thật, và vì sao công khai thuật toán nhưng không công khai tham số."
pubDate: "Oct 12 2026"
heroImage: '../../assets/hero-engine.jpg'
lang: vi
translationSlug: "veilus-human-input-rust-crate"
tags:
  - rust
  - open-source
  - automation
  - engineering
---

Khi trợ lý AI bấm một nút qua Veilus, phải có thứ quyết định con trỏ xuất phát từ đâu, cong về phía nào, đi nhanh hay chậm và giữ nút bao lâu. Chúng tôi viết phần đó cho các công cụ MCP `click`, `type` và `scroll` của Veilus, và hôm nay phát hành nó thành một crate riêng: [`veilus-human-input`](https://crates.io/crates/veilus-human-input), giấy phép MIT hoặc Apache-2.0, mã nguồn trên [GitHub](https://github.com/veilus/human-input).

Đây là một thư viện nhỏ gồm các hàm thuần. Bạn đưa vào tham số và một bộ sinh số ngẫu nhiên; nó trả về các điểm, các bước cuộn và các khoảng thời gian. Gửi chúng tới trình duyệt bằng cách nào — CDP `Input.dispatchMouseEvent`, WebDriver hay sự kiện của hệ điều hành — là việc của bạn. Không I/O, không async runtime, và cùng một hạt giống RNG thì luôn ra cùng một kết quả.

## Trông như thế nào

```toml
[dependencies]
veilus-human-input = "0.1"
rand = "0.8"
```

```rust
use rand::{rngs::StdRng, SeedableRng};
use veilus_human_input::{keyboard, mouse, wheel};

let mut rng = StdRng::seed_from_u64(42);

// Chuột: từ vị trí cuối cùng của con trỏ tới một điểm ngẫu nhiên trong nút.
let p = mouse::MouseParams::default();
let target = mouse::pick_point((300.0, 200.0, 420.0, 240.0), &p, &mut rng);
for step in mouse::path((40.0, 40.0), target, 120.0, &p, &mut rng) {
    // gửi mouseMoved tại (step.x, step.y), rồi chờ step.delay
}

// Con lăn: một cú cuộn khoảng 1.800 px theo kiểu gia tốc của macOS.
let w = wheel::WheelParams::default();
for (delta_y, wait) in wheel::wheel_events(wheel::WheelStyle::MacAccelerated, 1_800, &w, &mut rng) {
    // gửi mouseWheel với deltaY = delta_y, rồi chờ
}

// Gõ phím: thời gian giữ và khoảng nghỉ cho từng ký tự, kèm phím vật lý.
for (ch, t) in "Hello".chars().zip(keyboard::timings("Hello", &keyboard::TypingParams::default(), &mut rng)) {
    let key = keyboard::us_key(ch); // code "KeyH", keyCode 72, shift: true
    // keyDown, chờ t.hold, keyUp, chờ t.gap
}
```

## Các mô hình

- **Chuột.** Đường cong Bézier bậc ba có hai điểm điều khiển nằm cùng một phía của đường thẳng, nên con trỏ cong về một hướng thay vì lượn qua lại, với tốc độ tăng dần rồi giảm dần. Thời gian di chuyển theo định luật Fitts: mục tiêu càng xa, càng nhỏ thì đi càng lâu. Các điểm cách nhau một chu kỳ báo vị trí cố định, giống cách một con chuột thật báo vị trí. Những lần di chuyển dài sẽ đi lố qua mục tiêu rồi quay lại bằng một đoạn chỉnh ngắn; một số lần đi qua vài điểm trung gian trước. Điểm bấm rơi ngẫu nhiên vào vùng giữa của mục tiêu, không bao giờ đúng tâm.
- **Con lăn.** `Notched` gửi các bước đều nhau, có khoảng nghỉ, như con lăn có nấc. `MacAccelerated` gửi một cú vuốt: bước đầu rất nhỏ, tăng dần lên một dải bước lớn cách nhau vài mili giây.
- **Gõ phím.** Khoảng nghỉ giữa hai phím theo phân phối log-chuẩn — phần lớn nhanh, thỉnh thoảng có khoảng nghỉ dài — dài hơn sau dấu cách hay dấu câu, đôi khi có ngập ngừng. Mỗi phím được giữ trong một khoảng thời gian ngẫu nhiên. `us_key` đổi một ký tự thành `KeyboardEvent.code`, `keyCode` của Windows và trạng thái Shift trên bàn phím US; ký tự cần bộ gõ, như chữ có dấu, trả về `None`.

Mọi con số trong các mô hình trên đều là một trường của `MouseParams`, `WheelParams` hoặc `TypingParams`.

## Chỉ một tham số đã làm lộ tẩy

Chúng tôi ghi lại thao tác của một người trên một trang — 20 lần bấm vào mục tiêu có kích thước và vị trí ngẫu nhiên, gõ ba câu, một lần cuộn dài — rồi cho crate làm đúng các việc đó trong một trình duyệt Chromium. Với từng đặc trưng, chúng tôi so hai bên bằng phép kiểm Kolmogorov–Smirnov, và huấn luyện một bộ phân loại hồi quy logistic có kiểm chéo để phân biệt hai bên. Độ chính xác 0,5 nghĩa là nó không phân biệt được.

| Tham số | Bộ phân loại chuột | Bộ phân loại phím |
|---|---:|---:|
| `Default`, giữ nguyên | 1,00 | 0,63 ± 0,08 |
| `Default`, đặt `tick` bằng chu kỳ báo vị trí của chuột đã ghi | 0,38 ± 0,14 | 0,59 ± 0,05 |

Hàng đầu làm chúng tôi bất ngờ. Với tham số mặc định, bộ phân loại tách crate khỏi người thật **mọi lần**, và nó chỉ cần một đặc trưng: khoảng thời gian trung vị giữa hai sự kiện con trỏ. `tick` mặc định là 8 ms, tức một con chuột USB 125 Hz. Con chuột chúng tôi ghi lại báo vị trí mỗi 11 ms. Chừng nào con số đó còn lệch thì đường cong, tốc độ hay cú đi lố đều không quan trọng.

Đặt `tick` bằng chu kỳ của thiết bị đã ghi thì độ chính xác phần chuột còn 0,38 ± 0,14: với mẫu 20 đoạn di chuyển, không đặc trưng chuột nào nổi lên khỏi nhiễu. Bài học cho ai sinh thao tác nhập: **khớp với thiết bị mà bạn tự nhận** trước khi chỉnh bất cứ thứ gì khác.

Giới hạn, nói thẳng: một phiên của một người, trên macOS, với chuột có con lăn — 20 đoạn di chuyển chuột và 142 cặp phím. Như vậy chỉ nói được "gần với người này", không nói được "gần với con người nói chung". Crate không hứa rằng tự động hoá sẽ không bị nhận ra; nó gỡ đi những dấu hiệu máy móc lộ nhất trong nhịp và hình học của thao tác nhập.

## Vì sao thuật toán mở còn tham số của chúng tôi thì không

Bộ `Default` không phải bộ Veilus dùng. Nó được chọn từ hiểu biết công khai — chuột USB 125 Hz, bước cuộn 100 px của Chromium, nhịp gõ của một người gõ phổ thông — và các con số trong bảng trên là số đo của chính bộ mặc định đó.

Veilus truyền bộ tham số riêng của mình vào cùng các hàm này, và bộ đó không công khai. Bảng trên cho thấy lý do: chỉ một tham số đã đủ tách người khỏi crate hoàn toàn. Nếu công khai đúng các giá trị Veilus dùng, bất kỳ ai làm bộ dò tìm cũng sinh được vô hạn mẫu từ chúng và huấn luyện một mô hình nhận ra đúng Veilus. Công khai thuật toán cho họ biết *lớp* đường đi; nó không cho họ biết Veilus nằm ở đâu trong lớp đó.

Đây cũng là cách chia chúng tôi đã làm với [`veilus-fingerprint`](https://crates.io/crates/veilus-fingerprint), bộ sinh fingerprint mã nguồn mở của chúng tôi: công cụ chung thì công khai, phần tinh chỉnh của sản phẩm ở lại trong sản phẩm.

## Dùng thử

```bash
cargo add veilus-human-input rand@0.8
```

[README](https://github.com/veilus/human-input) có ví dụ đầy đủ, và [trang tài liệu](https://docs.veilus.io/vi/reference/human-input/) giải thích từng nhóm tham số. App Veilus sẽ chuyển các công cụ MCP `click`, `type` và `scroll` sang dùng crate này trong một bản phát hành sắp tới. Nếu bạn chỉnh bộ mặc định cho một thiết bị hay một nhóm người dùng và đo kết quả, chúng tôi rất muốn biết — hãy mở issue trên GitHub.

---

*Muốn trợ lý AI điều khiển hồ sơ trình duyệt thật? [Tải Veilus miễn phí](https://veilus.io/vi/download).*
