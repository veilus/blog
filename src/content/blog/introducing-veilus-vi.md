---
title: "Giới thiệu Veilus: Trình duyệt anti-detect mã nguồn mở"
description: "Veilus là trình duyệt anti-detect dựa trên Chromium, thay đổi fingerprint ở cấp engine — không dùng JavaScript injection. 100% mã nguồn mở."
pubDate: "2026-03-12"
lang: "vi"
tags: ["announcement", "veilus"]
---

## Vấn đề với browser fingerprinting

Nếu bạn từng quản lý nhiều tài khoản online, bạn hiểu cảm giác này. Website theo dõi "dấu vân tay" trình duyệt của bạn — kết hợp từ độ phân giải màn hình, font chữ, WebGL renderer, canvas hash, và hàng chục tín hiệu khác — để nhận diện bạn qua các phiên truy cập.

Kết quả? Dù bạn dùng VPN hay proxy, trình duyệt vẫn "tố" bạn.

## Giải pháp hiện tại — và giới hạn của chúng

Các công cụ anti-detect hiện tại như Multilogin, GoLogin, AdsPower đều dùng cùng một cách: **JavaScript injection**. Họ chạy script để chặn các lệnh gọi API của trình duyệt và trả về giá trị giả.

Vấn đề là gì?

- **JS injection có thể bị phát hiện.** Website có thể detect việc inject script, kiểm tra mâu thuẫn giữa giá trị thật và giả, hoặc dùng timing attack
- **Đắt.** Multilogin từ $99/tháng, GoLogin từ $49/tháng
- **Closed-source.** Bạn tin tưởng code độc quyền mà không thể kiểm tra nó làm gì

## Veilus khác gì?

Veilus không patch trình duyệt bằng JavaScript. Thay vào đó, chúng tôi **chỉnh sửa trực tiếp mã nguồn Chromium**.

Điều này có nghĩa là:

- **Quản lý fingerprint ở cấp engine** — Thay đổi tại C++, không phải JavaScript
- **Không có artifact injection** — Không có script để detect vì giá trị đến từ chính engine
- **Fingerprint nhất quán** — Không mâu thuẫn giữa các API layer khác nhau
- **Hiệu năng tốt hơn** — Không overhead từ việc chặn mỗi API call

## Dùng được chưa?

Veilus đang trong giai đoạn phát triển tích cực. Core engine modifications đang được xây dựng, hướng tới bản release đầu tiên với:

- Canvas và WebGL fingerprint management
- Navigator và screen API modifications
- Multi-profile isolation
- Proxy integration theo profile

## Free thật không?

**Thật.** Veilus là 100% mã nguồn mở. Mọi dòng code đều có thể kiểm tra được. Không có trình duyệt anti-detect nào khác cung cấp mức độ minh bạch này.

Toàn bộ code có trên [GitHub](https://github.com/nicholasgriffintn/veilus).

## Tham gia cộng đồng

Veilus được xây dựng công khai, và chúng tôi rất muốn có sự tham gia của bạn:

- ⭐ **Star trên [GitHub](https://github.com/nicholasgriffintn/veilus)** — Theo dõi quá trình phát triển
- 💬 **Tham gia [Telegram](https://t.me/veilusbrowser)** — Chat với team và cộng đồng
- 🐦 **Follow trên [X](https://x.com/veilusbrowser)** — Cập nhật tin tức mới nhất
- 📖 **Đọc [tài liệu](https://docs.veilus.io)** — Tìm hiểu kiến trúc và cách đóng góp

Dù bạn là developer quan tâm đến Chromium internals, researcher nghiên cứu fingerprinting, hay đơn giản là muốn một công cụ privacy tốt hơn — đều có chỗ cho bạn trong cộng đồng Veilus.

Cùng xây dựng một thứ minh bạch. 🚀
