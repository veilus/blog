---
title: "Giới thiệu Veilus: Quản lý nhiều tài khoản trên một máy"
description: "Veilus là trình duyệt antidetect, miễn phí 5 hồ sơ, chạy trên bản Chromium do Veilus tự vá. Quản lý nhiều tài khoản trên một máy, mỗi profile một fingerprint và proxy riêng."
pubDate: "Mar 12 2026"
updatedDate: "Oct 8 2026"
heroImage: '../../assets/blog-placeholder-5.jpg'
lang: vi
translationSlug: "introducing-veilus"
tags:
  - announcement
  - product
---

Bạn quản lý tài khoản cho nhiều khách hàng, nhiều shop hay nhiều thương hiệu trên cùng một máy. Cả ngày đăng nhập rồi đăng xuất, phiên của tài khoản này lẫn sang tài khoản kia, mọi thứ dồn vào một trình duyệt.

Và nền tảng không chỉ nhìn vào IP. Họ theo dõi **browser fingerprint** — một tổ hợp gồm độ phân giải màn hình, font chữ, WebGL renderer, canvas hash, và hàng chục tín hiệu khác. Cookie xóa được, VPN đổi được, nhưng fingerprint thì không.

**Đó là lý do cần tách mỗi tài khoản ra một trình duyệt riêng.**

## Ai cần trình duyệt anti-detect?

| Đối tượng | Vấn đề thường gặp |
|-----------|-------------------|
| **Agency** | Chạy quảng cáo và mạng xã hội cho nhiều khách mà không lẫn đăng nhập, dữ liệu |
| **Bán hàng đa nền tảng** | Mỗi shop Shopee/Lazada/Amazon một trình duyệt, đăng nhập, cookie và proxy riêng |
| **Quản lý mạng xã hội** | Mở nhiều tài khoản thương hiệu cạnh nhau, không phải đăng xuất |
| **QA và lập trình viên** | Kiểm tra website trên nhiều cấu hình thiết bị, ngôn ngữ, vị trí |
| **Nghiên cứu dữ liệu** | Thu thập dữ liệu công khai bằng hồ sơ trình duyệt thật |

Nếu bạn gặp những vấn đề trên, Veilus sinh ra là để giải quyết chúng.

## Veilus là gì?

Veilus là **trình duyệt antidetect**, miễn phí 5 hồ sơ. Mỗi profile trình duyệt có một fingerprint riêng biệt, nên mỗi tài khoản trông như đang chạy trên một máy tính khác.

## Chromium do Veilus tự vá

Mỗi profile chạy trên [bản Chromium do Veilus tự vá](https://docs.veilus.io/engine/chromium/). Fingerprint được áp ngay trong mã C++ của trình duyệt, không phải chèn JavaScript vào trang.

Ứng dụng quản lý bên ngoài — danh sách profile, cấu hình fingerprint và proxy, tự động hóa — là app desktop viết bằng Tauri 2 và Rust, chạy trên Windows 10/11 (x64) và macOS 13 trở lên (Apple Silicon).

## Tính năng chính

### Fingerprint Engine
Mỗi profile có [fingerprint riêng](https://docs.veilus.io/vi/profiles/fingerprinting/), các giá trị được sinh sao cho khớp nhau như một thiết bị thật: hệ điều hành, màn hình, font chữ, card đồ họa và phiên bản trình duyệt cùng mô tả một chiếc máy hợp lý, không phải một mớ giá trị ngẫu nhiên.

### Veilus Flow — Tự động hóa
Kết nối một trợ lý AI có hỗ trợ MCP, như Claude Code hay Cursor, rồi giao việc ([MCP server hoạt động thế nào](https://veilus.io/vi/features/mcp/)): nó viết script Playwright, Veilus chạy script đó trên nhiều profile. Bạn cũng có thể tự viết script rồi đưa vào qua [REST API cục bộ](https://docs.veilus.io/vi/reference/rest-api/). Phù hợp để:
- Lấy báo cáo hằng ngày từ dashboard của từng khách
- Kiểm tra giá và gian hàng trên các shop
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

**Free.** 5 profile vĩnh viễn, không giới hạn thời gian, không cần thẻ tín dụng. Tải về là dùng được luôn. Các gói trả phí xem ở [trang giá](https://veilus.io/vi/pricing/).

## Bắt đầu

Sẵn sàng cho mỗi tài khoản một trình duyệt riêng?

- 🌐 **Tải về**: [veilus.io](https://veilus.io)
- 💬 **Telegram**: [t.me/veilusbrowser](https://t.me/veilusbrowser)
- 🐦 **X**: [@veilusbrowser](https://x.com/veilusbrowser)
- 🐙 **GitHub**: [github.com/veilus](https://github.com/veilus)
