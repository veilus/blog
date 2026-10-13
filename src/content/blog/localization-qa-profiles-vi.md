---
title: "Kiểm thử website ở tám ngôn ngữ và múi giờ mà không cần tám chiếc laptop"
description: "Cách kiểm tra bản địa hoá của website — ngôn ngữ, ngày giờ, tiền tệ, chuyển hướng — trên nhiều hồ sơ trình duyệt, mỗi hồ sơ một ngôn ngữ và múi giờ, rồi chạy một script Playwright trên tất cả."
pubDate: "Oct 15 2026"
heroImage: '../../assets/hero-profiles.jpg'
lang: vi
translationSlug: "localization-qa-profiles"
tags:
  - qa
  - localization
  - playwright
  - tutorial
---

Một website trông đúng trên trình duyệt của bạn vẫn có thể chào khách ở Tokyo bằng sai ngôn ngữ, hiện ngày là 10/14 thay vì 14/10, hoặc chuyển một khách ở Đức sang trang tiếng Anh. Trình duyệt của bạn chỉ cho bạn thấy một ngôn ngữ và một múi giờ: của chính bạn.

Bài này đi qua cách kiểm tra điều đó từ một máy tính với Veilus. Mỗi hồ sơ trình duyệt mang ngôn ngữ và múi giờ riêng, nên một nhóm hồ sơ trở thành một nhóm khách đến từ nhiều nơi, và một script Playwright kiểm tra tất cả.

## Hồ sơ đổi được gì, và không đổi được gì

Khi tạo hồ sơ, bước **Language & Region** đặt hai thứ mà website đọc từ trình duyệt:

- **Language**: ngôn ngữ trình duyệt mà website thấy, quyết định `navigator.language` và ngôn ngữ website chọn khi nó dựa vào trình duyệt.
- **Timezone**: múi giờ mà website thấy, quyết định cách `Date` hiển thị giờ. Toạ độ của hồ sơ đi theo múi giờ.

Bấm vào một thị trường để điền cả hai, hoặc tự đặt. **Config check** bên dưới báo các chỗ mâu thuẫn, ví dụ ngôn ngữ không khớp múi giờ. Xem [Fingerprint](https://docs.veilus.io/vi/profiles/fingerprinting/).

Thứ hồ sơ không đổi là địa chỉ IP của bạn. Website chọn ngôn ngữ hay tiền tệ theo IP của khách vẫn thấy mạng của bạn thoát ra ở đâu. Nếu điều đó quan trọng với phần bạn đang kiểm tra, hãy gắn cho mỗi hồ sơ một proxy ở đúng vùng ([Proxy](https://docs.veilus.io/vi/profiles/proxy/)).

Điều này còn liên quan tới một thiết lập. Trước mỗi lần mở, Veilus so múi giờ của hồ sơ với nơi proxy, hoặc mạng của bạn, thoát ra. Mặc định là **Block**: một hồ sơ Tokyo trên kết nối ở Việt Nam sẽ không mở. Để kiểm thử trên máy mà không có proxy theo vùng, hãy chuyển **Settings → Timezone check** sang **Warn** hoặc **Off** trước.

## Bước 1: mỗi thị trường một hồ sơ

Tạo mỗi thị trường bạn phục vụ một hồ sơ: chọn hệ điều hành và một thị trường. Ở gói trả phí hoặc khi dùng thử, **Batch create** tạo tối đa 50 hồ sơ một lần. Ví dụ `ja-JP` với `Asia/Tokyo`, `de-DE` với `Europe/Berlin`, `pt-BR` với `America/Sao_Paulo`. Gắn tag `l10n` để chọn chúng cùng lúc về sau ([Tạo hồ sơ](https://docs.veilus.io/profiles/create/), tiếng Anh). Ở tab **Automation** của từng hồ sơ, thêm biến `EXPECT_LANG` với ngôn ngữ thị trường đó phải nhận, ví dụ `ja`.

Gói Free có 5 hồ sơ, đủ cho năm thị trường. Chạy script trên các hồ sơ này cần gói trả phí hoặc 7 ngày dùng thử Pro.

## Bước 2: viết một phép kiểm tra

Script của Veilus là một chương trình Playwright bình thường. Nó nối vào trình duyệt của hồ sơ qua cổng Veilus truyền vào, rồi in ra những gì bạn muốn đọc lại:

```ts
import { chromium } from "playwright";

async function main() {
  const browser = await chromium.connectOverCDP(
    `http://127.0.0.1:${process.env.VEILUS_DEBUG_PORT}`,
  );
  const context = browser.contexts()[0];
  const page = context.pages()[0] ?? (await context.newPage());

  await page.goto(process.env.VEILUS_VAR_URL ?? "https://example.com/");
  const report = await page.evaluate(() => ({
    url: location.href,
    htmlLang: document.documentElement.lang,
    browserLang: navigator.language,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sampleDate: new Date(Date.UTC(2026, 9, 14, 9, 30)).toLocaleString(),
  }));
  console.log(JSON.stringify(report));

  const expected = process.env.VEILUS_VAR_EXPECT_LANG;
  if (expected && !report.htmlLang.startsWith(expected)) {
    console.error(`expected ${expected}, page declares "${report.htmlLang}"`);
    process.exitCode = 1;
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

Mỗi hồ sơ in ra một dòng: website đưa nó tới đâu, trang khai ngôn ngữ gì, và một thời điểm cố định hiện ra thế nào ở hồ sơ đó. Nếu trang khai ngôn ngữ khác `EXPECT_LANG`, script thoát với mã 1 và hồ sơ đó bị tính là thất bại. URL đến từ một biến, nên cùng một script kiểm được cả staging lẫn production ([Script](https://docs.veilus.io/automation/scripts/), tiếng Anh).

Bạn cũng có thể nhờ trợ lý AI viết. Nối Claude Code hay Cursor qua MCP rồi mô tả phép kiểm tra bằng một câu; trợ lý chạy thử script trên tối đa 3 hồ sơ và tự sửa lỗi trước khi bạn xem ([Cài đặt MCP](https://blog.veilus.io/blog/claude-code-anti-detect-browser-mcp-vi/)).

## Bước 3: chạy trên mọi thị trường

Duyệt script trong **Veilus Flow**, rồi chạy nó trên các hồ sơ `l10n`. Trong hộp thoại Run, **Concurrency** đặt số hồ sơ chạy cùng lúc (1, 2, 3, 4, 5, 8 hoặc 10). Bấm vào lượt chạy để xem mã thoát và output của từng hồ sơ, mỗi thị trường một dòng JSON ([Lượt chạy](https://docs.veilus.io/automation/runs/), tiếng Anh).

Những chỗ đáng đọc trong output:

- `url` khác nhau giữa các thị trường khi website chuyển hướng theo ngôn ngữ. Kiểm tra mỗi thị trường tới đúng trang bạn muốn.
- `htmlLang` phải khớp ngôn ngữ thật của trang. Một trang tiếng Đức vẫn ghi `lang="en"` gây khó cho cả trình đọc màn hình lẫn công cụ tìm kiếm.
- `sampleDate` là cùng một thời điểm ở mọi hồ sơ. Nếu trang tự định dạng ngày, hãy so chữ trên trang với giá trị này.

## Bước 4: cho nó chạy đều

Đặt script đã duyệt chạy theo lịch, ví dụ hằng ngày, để một bản dịch hỏng hay một lần chuyển hướng sai hiện ra thành một hồ sơ thất bại thay vì một email phàn nàn của khách ([Lịch chạy](https://docs.veilus.io/automation/schedules/), tiếng Anh).

## Đọc tiếp

- [Tạo hồ sơ](https://docs.veilus.io/profiles/create/) và [Timezone check](https://docs.veilus.io/vi/profiles/proxy/#timezone-check)
- [Script nhận được gì](https://docs.veilus.io/automation/scripts/#what-a-script-receives)
- [Tải Veilus](https://veilus.io/vi/download/), miễn phí 5 hồ sơ
