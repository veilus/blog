---
title: "Giới thiệu Veilus: Quản lý nhiều tài khoản trên một máy"
description: "Veilus là trình duyệt anti-detect miễn phí, chạy trên bản Chromium do Veilus tự vá. Quản lý nhiều tài khoản trên một máy, mỗi profile một fingerprint và proxy riêng."
pubDate: "Mar 12 2026"
heroImage: '../../assets/blog-placeholder-5.jpg'
lang: vi
translationSlug: "introducing-veilus"
tags:
  - announcement
  - product
---

Bạn chạy nhiều tài khoản quảng cáo trên Facebook. Một hôm đăng nhập vào, thấy hàng loạt tài khoản bị khóa cùng lúc. Hoặc bạn bán hàng trên nhiều shop Shopee, và nền tảng phát hiện tất cả đều từ cùng một máy tính.

Chuyện này xảy ra vì nền tảng không chỉ theo dõi IP. Họ theo dõi **browser fingerprint** — một tổ hợp gồm độ phân giải màn hình, font chữ, WebGL renderer, canvas hash, và hàng chục tín hiệu khác. Cookie xóa được, VPN đổi được, nhưng fingerprint thì không.

**Đó là lý do bạn cần trình duyệt anti-detect.**

## Ai cần trình duyệt anti-detect?

| Đối tượng | Vấn đề thường gặp |
|-----------|-------------------|
| **Chạy quảng cáo** | Facebook/Google link tài khoản rồi khóa hàng loạt |
| **Bán hàng đa nền tảng** | Shopee/Lazada/Amazon phát hiện nhiều shop từ một máy |
| **Quản lý mạng xã hội** | Instagram/TikTok khóa khi phát hiện cùng thiết bị |
| **Thu thập dữ liệu** | Bị chặn IP sau vài trăm request |
| **Crypto/Airdrop** | Bị phát hiện Sybil khi dùng nhiều ví |

Nếu bạn gặp những vấn đề trên, Veilus sinh ra là để giải quyết chúng.

## Veilus là gì?

Veilus là **trình duyệt anti-detect miễn phí**. Mỗi profile trình duyệt có một fingerprint riêng biệt, nên mỗi tài khoản trông như đang chạy trên một máy tính khác.

## Chromium do Veilus tự vá

Mỗi profile chạy trên bản Chromium do Veilus tự vá. Fingerprint được áp ngay trong mã C++ của trình duyệt, không phải chèn JavaScript vào trang.

Ứng dụng quản lý bên ngoài — danh sách profile, cấu hình fingerprint và proxy, tự động hóa — là app desktop viết bằng Tauri 2 và Rust, chạy trên Windows 10/11 (x64) và macOS 13 trở lên (Apple Silicon).

## Tính năng chính

### Fingerprint Engine
Mỗi profile có fingerprint riêng, các giá trị được sinh sao cho khớp nhau như một thiết bị thật: hệ điều hành, màn hình, font chữ, card đồ họa và phiên bản trình duyệt cùng mô tả một chiếc máy hợp lý, không phải một mớ giá trị ngẫu nhiên.

### Veilus Flow — Tự động hóa
Kết nối một trợ lý AI có hỗ trợ MCP, như Claude Code hay Cursor, rồi giao việc: nó viết script Playwright, Veilus chạy script đó trên nhiều profile. Bạn cũng có thể tự viết script rồi đưa vào qua REST API cục bộ. Phù hợp để:
- Warm tài khoản quảng cáo tự động
- Đăng bài hàng loạt
- Thu thập dữ liệu sản phẩm
- Chạy workflow lặp lại trên 50+ profile

### Veilus Sync
Đồng bộ profile giữa các máy của bạn qua Git repository hoặc Google Drive do bạn chọn — nên dùng loại riêng tư. Sang máy khác là làm việc tiếp được ngay.

## Hoạt động thế nào?

Mỗi profile trong Veilus có 3 lớp cách ly:

1. **Fingerprint riêng** — website nhìn thấy một thiết bị khác cho mỗi profile
2. **Storage riêng** — cookies, localStorage, cache hoàn toàn tách biệt
3. **Proxy riêng** — mỗi profile dùng IP khác nhau

Mở Profile A và Profile B cạnh nhau — như đang dùng hai máy tính khác nhau, trên hai mạng khác nhau.

## Free không?

**Free.** 5 profile vĩnh viễn, không giới hạn thời gian, không cần thẻ tín dụng. Tải về là dùng được luôn.

## Bắt đầu

Không muốn bị khóa tài khoản nữa?

- 🌐 **Tải về**: [veilus.io](https://veilus.io)
- 💬 **Telegram**: [t.me/veilusbrowser](https://t.me/veilusbrowser)
- 🐦 **X**: [@veilusbrowser](https://x.com/veilusbrowser)
- 🐙 **GitHub**: [github.com/veilus](https://github.com/nicholasgriffintn/veilus)
