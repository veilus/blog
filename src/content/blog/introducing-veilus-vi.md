---
title: "Giới thiệu Veilus: Giờ đầu tiên, từ cài đặt tới script chạy theo lịch"
description: "Đi qua phiên làm việc đầu tiên với Veilus: cài app, tải engine, tạo hồ sơ có proxy, kết nối trợ lý AI qua MCP, duyệt script nó viết và đặt lịch chạy."
pubDate: "Mar 12 2026"
updatedDate: "Oct 9 2026"
heroImage: '../../assets/blog-placeholder-5.jpg'
lang: vi
translationSlug: "introducing-veilus"
tags:
  - announcement
  - product
  - tutorial
---

[Trang chủ](https://veilus.io/vi/) nói Veilus là gì. Bài này cho thấy dùng nó trông thế nào: một lần ngồi, từ lúc cài mới tới khi có một script tự chạy mỗi sáng. Mỗi bước có link tới trang tài liệu ghi đủ chi tiết.

## 1. Cài app, rồi tải engine

Veilus chạy trên Windows 10 hoặc 11 (x64) và macOS 13 trở lên trên chip Apple Silicon. Tải bộ cài ở [trang tải về](https://veilus.io/vi/download/). Lần mở đầu, Windows và macOS đều không nhận ra nhà phát hành nên bạn bấm qua một cảnh báo: **More info → Run anyway** trên Windows, **Open Anyway** trong Privacy & Security trên macOS. [Hướng dẫn cài đặt](https://docs.veilus.io/vi/getting-started/installation/) ghi đúng từng bước.

Bộ cài không kèm trình duyệt. Mở **Settings → Engine & updates** và bấm **Download** cạnh phiên bản gắn nhãn **Latest**. Đó là bản Chromium do Veilus tự dựng, mọi hồ sơ đều chạy trên nó. Engine tải về đầu tiên tự được bật. [Thêm về engine](https://docs.veilus.io/engine/chromium/).

## 2. Tạo hồ sơ đầu tiên

Bấm **New profile**. Chọn hệ điều hành mà hồ sơ sẽ khai với website. Mặc định là hệ điều hành của máy bạn, và đó là lựa chọn an toàn hơn: hồ sơ cho hệ điều hành khác phải giả nhiều thứ hơn, nên Veilus cảnh báo khi bạn chọn. Sau đó chọn một thị trường ở **Language & Region**, hoặc tự đặt ngôn ngữ và múi giờ, rồi bấm **Create Profile**.

Veilus sinh một [fingerprint](https://docs.veilus.io/vi/profiles/fingerprinting/) khớp với hệ điều hành bạn chọn. Bấm nút mở trên dòng của hồ sơ, giữ **Browser Only**, một cửa sổ trình duyệt mở ra với fingerprint, cookie và dữ liệu riêng của hồ sơ đó.

## 3. Gắn proxy

Mở bảng của hồ sơ và vào tab **Network**. Với một hồ sơ, điền **Manual Proxy** (HTTP, SOCKS5 hoặc residential) rồi bấm **Test Proxy**. Với nhiều hồ sơ, tạo một **proxy pool** từ danh sách rồi gán cho chúng. [Cài đặt proxy](https://docs.veilus.io/vi/profiles/proxy/) nói cả hai cách.

Đây là bước nhiều người vấp nhất. Mặc định Veilus không mở hồ sơ có múi giờ lệch với nơi proxy đi ra, vì IP Mỹ mà múi giờ Việt Nam là tự mâu thuẫn. Khi đã gán pool, **Match to proxy** đo nơi proxy thật sự đi ra và đề xuất múi giờ khớp. Với proxy thủ công, tự đặt **Timezone** ở tab Fingerprint. Lưu lại là hồ sơ mở được.

Để kiểm kết quả, đánh dấu hồ sơ và bấm **Test**. Veilus mở hồ sơ trên một loạt trang kiểm tra fingerprint, cột **Score** cho biết qua được bao nhiêu trang.

## 4. Kết nối trợ lý AI

Mọi bước trên đều dùng được với gói Free: 5 hồ sơ trên một máy. Tự động hoá, lịch chạy và API/MCP cục bộ cần gói trả phí hoặc 7 ngày dùng thử Pro. Xem [gói và giấy phép](https://docs.veilus.io/vi/reference/plans-and-license/).

Mở **API & MCP** ở thanh bên, bấm **Turn on port** (chỉ nghe trên máy của bạn), tạo token, rồi chép đoạn cấu hình có sẵn cho Claude Code, Cursor hoặc Claude Desktop. [Trang MCP](https://veilus.io/vi/features/mcp/) cho thấy trợ lý làm việc với Veilus thế nào. Nếu dùng Claude Code, plugin Veilus thêm các skill đi qua từng bước và dừng lại chờ bạn quyết.

## 5. Giao việc bằng một câu

Mô tả việc như nói với đồng nghiệp: "Mở hồ sơ đầu tiên, vào trang đăng nhập dashboard của mình, viết script đăng nhập rồi in ra tên tài khoản, và chạy thử."

Trợ lý mở một hồ sơ thật, xem trang, viết một script Playwright và lưu vào Veilus Flow. Khi script chưa được duyệt, nó được chạy thử trên tối đa 3 hồ sơ và đọc lại kết quả từng hồ sơ, nên nó tự sửa lỗi trước khi tới lượt bạn xem. [Hướng dẫn cho LLM](https://docs.veilus.io/vi/recipes/llm-scripts/) ghi từng lời gọi công cụ trên đường đi.

## 6. Đọc, rồi duyệt

Mở **Veilus Flow**. Script mang nhãn **MCP** và nằm trong **Pending approval**. Đọc phần thay đổi, hoặc toàn bộ mã, rồi bấm **Approve this script**. Bước này có vì script đã duyệt sẽ chạy không người trông, với hồ sơ và đăng nhập của bạn. Việc duyệt làm trong app, không bao giờ qua trợ lý. Nếu trợ lý lưu bản mới, script quay lại chờ duyệt. [Thêm về duyệt script](https://docs.veilus.io/automation/scripts/).

## 7. Đặt lịch

Bảo trợ lý chạy script đã duyệt mỗi ngày lúc 09:00, hoặc tự tạo lịch ở tab **Schedule**: hằng ngày, hằng tuần, vài phút một lần, biểu thức cron hoặc chạy một lần. Lịch có thể nhắm vào một bộ lọc đã lưu thay vì danh sách cố định, nên hồ sơ bạn gắn thẻ sau này tự được tính vào. [Lịch chạy](https://docs.veilus.io/automation/schedules/).

Lịch chỉ chạy khi Veilus đang chạy và máy không ngủ. Bật **Run in background** trong Settings, đóng cửa sổ sẽ đưa Veilus xuống khay hệ thống thay vì thoát.

## Những gì trợ lý không làm được

Vài giới hạn có sẵn. Không công cụ nào xoá hồ sơ, proxy pool, script hay lịch: việc xoá ở lại trong app, trong tay bạn. Giá trị bạn lưu trên hồ sơ, như thông tin đăng nhập, chỉ tới được script đã duyệt. Và cùng lúc mở tối đa 16 trình duyệt hồ sơ, tính tất cả các đường, nên một lượt chạy lớn sẽ chờ chỗ trống thay vì làm quá tải máy.

## Đọc tiếp

- [Bắt đầu nhanh trong tài liệu](https://docs.veilus.io/vi/getting-started/quickstart/)
- [Bảng giá](https://veilus.io/vi/pricing/)
- [Telegram](https://t.me/veilusbrowser) để hỏi, [GitHub](https://github.com/veilus) để báo lỗi
