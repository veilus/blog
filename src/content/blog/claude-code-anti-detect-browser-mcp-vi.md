---
title: "Nối Claude Code với trình duyệt antidetect qua MCP: cài đặt, công cụ và giới hạn"
description: "Cách nối Claude Code, Cursor hoặc Claude Desktop với Veilus qua MCP, 39 công cụ cho trợ lý AI làm được gì với hồ sơ trình duyệt của bạn, và những giới hạn để nó không hành động khi chưa có bạn."
pubDate: "Oct 11 2026"
heroImage: '../../assets/hero-mcp-demo-vi.jpg'
lang: vi
translationSlug: "claude-code-anti-detect-browser-mcp"
tags:
  - mcp
  - tutorial
  - automation
---

Veilus chạy nhiều hồ sơ trình duyệt trên một máy, mỗi hồ sơ có fingerprint, cookie và proxy riêng. Veilus cũng có sẵn một MCP server, nên trợ lý AI như Claude Code tạo được hồ sơ, mở chúng, đọc trang, viết script Playwright và đặt lịch chạy. Bài này đi qua cách cài, những gì trợ lý làm được và không làm được, và vì sao vài việc luôn nằm trong tay bạn.

[Xem video demo 55 giây trên YouTube](https://www.youtube.com/watch?v=Zyt34L6yZ2k): một câu trong Claude Code, ba hồ sơ, một script được chạy thử trên cả ba, một lần duyệt, rồi một lịch chạy hằng ngày.

## Cần chuẩn bị

- Veilus trên Windows 10/11 (x64) hoặc macOS trên chip Apple Silicon, tải ở [trang tải về](https://veilus.io/vi/download/), và đã tải engine trong **Settings → Engine & updates**.
- Gói trả phí hoặc 7 ngày dùng thử Pro. Gói Free (5 hồ sơ trên một máy) không có API cục bộ và MCP. Xem [gói và giấy phép](https://docs.veilus.io/vi/reference/plans-and-license/).
- Một MCP client: Claude Code, Cursor hoặc Claude Desktop.

## Bước 1: Bật API cục bộ

Mở **API & MCP** ở thanh bên của app và bấm **Turn on port**. Cổng này chỉ nghe trên chính máy của bạn. Cũng ở trang đó, tạo một token. Mọi lời gọi MCP đều mang token này, nên giữ nó như mật khẩu.

## Bước 2: Nối client

File chạy của app Veilus có lệnh con `mcp`, giao tiếp MCP qua stdio. Trang **API & MCP** có sẵn đoạn cấu hình đã điền đúng đường dẫn file chạy và token của bạn, nên chép từ đó. Với Claude Code, nó trông như sau:

```bash
claude mcp add --scope user veilus -e VEILUS_API_TOKEN=<token> -- "<path to Veilus>" mcp
```

`--scope user` cho Claude Code thấy Veilus ở mọi thư mục bạn mở. Với Cursor hoặc Claude Desktop, đoạn cấu hình đi vào file cấu hình MCP của client:

```json
{
  "mcpServers": {
    "veilus": {
      "command": "<path to Veilus>",
      "args": ["mcp"],
      "env": { "VEILUS_API_TOKEN": "<token>" }
    }
  }
}
```

## Bước 3 (Claude Code): cài plugin

MCP client nào cũng dùng thẳng các công cụ được. Nếu bạn dùng Claude Code, plugin Veilus thêm bốn skill dẫn bạn đi từng bước qua một việc và dừng lại ở những chỗ cần bạn quyết:

```bash
claude plugin marketplace add veilus/claude-plugin
claude plugin install veilus@veilus
```

Khởi động lại Claude Code rồi gõ `/veilus:` để thấy chúng: `campaign` cho trọn một việc, `script` để viết và chạy thử script, `schedule` để lên kế hoạch lịch chạy và cho bạn xem dạng bảng trước khi tạo, và `run` để chạy script ngay và giải thích lỗi theo từng hồ sơ. Plugin là [mã nguồn mở, có trên GitHub](https://github.com/veilus/claude-plugin).

## Trợ lý làm được gì

Tính tới tháng 10/2026, server có 39 công cụ. [Tài liệu tham chiếu MCP](https://docs.veilus.io/vi/reference/mcp/) liệt kê từng công cụ kèm tham số. Chúng chia thành năm nhóm:

| Nhóm | Số công cụ | Làm gì |
|---|---|---|
| Hồ sơ và proxy | 10 | Tạo tới 50 hồ sơ trong một lệnh, mở và dừng hồ sơ, nhập danh sách proxy thành pool, kiểm tra proxy, gán pool |
| Trang web | 9 | Mở URL trong một hồ sơ đang chạy, đọc trang dưới dạng accessibility snapshot, bấm và gõ bằng sự kiện chuột và phím thật, cuộn, chờ một phần tử, đính kèm file |
| Script | 6 | Lưu script Playwright vào Veilus Flow, đọc lại, chạy thử và đọc output của từng hồ sơ |
| Lượt chạy và lịch | 7 | Chạy script đã duyệt trên nhiều hồ sơ, đặt lịch, bật tắt lịch, xem các lượt chạy, xem máy này mở được bao nhiêu trình duyệt cùng lúc |
| Dataset | 7 | Bảng dữ liệu đầu vào theo hồ sơ, ví dụ mỗi hồ sơ một dòng tài khoản, để script đã duyệt đọc |

Các công cụ trang web làm việc bên trong một hồ sơ đang chạy, với fingerprint và phiên đăng nhập của chính hồ sơ đó. Trợ lý không tự mở một trình duyệt riêng.

## Yêu cầu đầu tiên

Mô tả việc như bạn nói với một đồng nghiệp. Đây là yêu cầu trong video demo:

```
Create 3 Veilus profiles named "Demo {n}". Then write a script that opens
https://quotes.toscrape.com/ and prints the first quote and its author.
Test it on those 3 profiles.
```

Trợ lý gọi `create_profiles`, mở một hồ sơ, dùng `navigate` và `snapshot` để hiểu trang, rồi lưu script bằng `save_script`. Sau đó nó chạy thử script bằng `run_script` trên ba hồ sơ và đọc output của từng hồ sơ bằng `get_run_result`. Nếu một lượt lỗi, nó đọc lỗi, sửa script và lưu lại, tất cả trước khi bạn kịp xem gì.

Script theo một quy ước cố định: nối vào trình duyệt của chính hồ sơ qua CDP thay vì tự mở trình duyệt, và không đụng tới user agent hay viewport vì những thứ đó thuộc về hồ sơ. [Hướng dẫn cho LLM](https://docs.veilus.io/vi/recipes/llm-scripts/) có đủ quy tắc và một script mẫu tối thiểu.

## Duyệt script nằm trong app

Script do trợ lý lưu thì **chưa được duyệt**. Nó chạy thử được trên tối đa 3 hồ sơ, nhưng chạy hàng loạt và lịch chạy chỉ nhận script đã duyệt. Để duyệt, mở **Veilus Flow**: script mang nhãn **MCP** nằm trong **Pending approval**. Đọc phần thay đổi hoặc toàn bộ mã nguồn, rồi bấm **Approve this script**.

Không có công cụ nào để duyệt. Script đã duyệt chạy không người trông với hồ sơ và phiên đăng nhập của bạn, và nó là một chương trình Node bình thường chạy với quyền của tài khoản máy bạn, nên nó cần được đọc kỹ như một pull request. Nếu sau đó trợ lý lưu bản mới, script quay lại chờ duyệt.

Duyệt xong, một câu nữa là đủ: "I approved it. Schedule it for those 3 profiles every day at 9:00."

## Những giới hạn khác của trợ lý

- **Tạo và dừng được, không xoá được.** Không công cụ nào xoá hồ sơ, proxy pool, script hay lịch. Trợ lý tắt được lịch; khi tắt, lịch và lịch sử chạy vẫn được giữ.
- **Proxy đang có không bị ghi đè nhầm.** Gán pool sẽ từ chối cả lệnh nếu có hồ sơ nào đã có proxy, trừ khi trợ lý chủ động ép ghi đè.
- **Lệnh tốn tài nguyên bị giới hạn tốc độ.** Mỗi token được tối đa 30 lần mở hồ sơ, chạy script, tạo hồ sơ hoặc nhập proxy trong 60 giây.
- **Dữ liệu bí mật chỉ tới script đã duyệt.** Biến của hồ sơ và dòng dataset chỉ được đưa cho script đã duyệt. Lượt chạy thử của script chưa duyệt chỉ thấy những gì được truyền vào đúng lệnh đó.
- **`evaluate_js` không phải sandbox.** Nó chạy JavaScript trong một trang đang đăng nhập, với đúng quyền của trang đó. Trên tài khoản quan trọng, chỉ để trợ lý bạn tin cậy dùng nó.

Lịch chỉ chạy khi Veilus đang mở và máy đang thức. Bật **Run in background** trong Settings để khi đóng cửa sổ, Veilus thu xuống khay hệ thống thay vì thoát.

## Thử ngay

[Tải Veilus](https://veilus.io/vi/download/), bật 7 ngày dùng thử Pro trong app, rồi nối trợ lý từ trang **API & MCP**. [Trang MCP](https://veilus.io/vi/features/mcp/) có phần tổng quan, và [bài giờ đầu tiên](/blog/introducing-veilus-vi/) đi qua hồ sơ và proxy nếu bạn mới dùng Veilus.

Chỉ dùng Veilus cho tài khoản của bạn hoặc tài khoản bạn được phép quản lý. Xem [Chính sách sử dụng chấp nhận được](https://veilus.io/vi/acceptable-use/).
