---
title: "Chạy framework agent trên hồ sơ Veilus"
description: "Nối script Python hoặc agent browser-use vào một hồ sơ Veilus bằng SDK veilus, để nó chạy với vân tay, proxy và cookie của hồ sơ đó. Mười công cụ đã chạy thử trên hồ sơ thật, và những giới hạn."
pubDate: "Oct 14 2026"
heroImage: '../../assets/hero-engine.jpg'
lang: vi
translationSlug: "veilus-sdk-agent-frameworks"
tags:
  - sdk
  - python
  - automation
  - ai-agents
---

Script agent thường tự mở một trình duyệt dùng một lần. Trình duyệt đó không có lịch sử, không có cookie, không có danh tính ổn định, và mỗi lần chạy lại bắt đầu từ số không. Nếu agent làm việc trên một tài khoản, một cửa hàng hay một tác vụ nghiên cứu mà cần trông như cùng một người quay lại, nó cần một trình duyệt có danh tính riêng.

Hồ sơ Veilus chính là trình duyệt đó: có vân tay, proxy và cookie riêng. SDK `veilus` mở hồ sơ rồi đưa cho script địa chỉ của nó, nên các công cụ bạn đang dùng chạy bên trong hồ sơ thay vì chạy bên cạnh.

## Nối một hồ sơ

Bạn cần ứng dụng Veilus trên máy bản 0.2.9 trở lên, đang chạy, đã bật API cục bộ (trang **API & MCP** ở thanh bên, gói Pro trở lên). Tạo token ở trang đó rồi đặt vào biến môi trường:

```bash
pip install "veilus[playwright]"
export VEILUS_API_TOKEN=...
```

```python
import asyncio
from veilus import Veilus


async def main():
    veilus = Veilus()
    profiles = await veilus.list_profiles()

    session = await veilus.connect(profiles[0]["id"])
    await session.page.goto("https://example.com")
    print(await session.page.title())
    await session.close()  # disconnects Playwright; the profile keeps running

    await veilus.stop(profiles[0]["id"])


asyncio.run(main())
```

`connect()` dùng lại hồ sơ nếu nó đang chạy, nếu không thì mở hồ sơ. Hàm trả về context và trang của chính hồ sơ. Đừng tạo context mới với user agent, viewport hay locale của riêng bạn: chúng sẽ ghi đè giá trị của hồ sơ trong context đó.

SDK chỉ đọc token từ mã của bạn hoặc từ `VEILUS_API_TOKEN`. Địa chỉ CDP của hồ sơ không có mật khẩu, nên mọi chương trình trên máy đều dùng được khi hồ sơ đang chạy; nó chỉ lắng nghe ở `127.0.0.1`.

## Agent browser-use trên một hồ sơ

Các công cụ gắn vào một Chromium đang chạy chỉ cần địa chỉ CDP của hồ sơ. `launch()` trả về địa chỉ đó ở trường `cdpUrl`. Dưới đây một agent browser-use, điều khiển bởi một model Claude, mở một trang trên hồ sơ và báo lại tiêu đề:

```python
import asyncio
import os

from browser_use import Agent, Browser
from browser_use.llm import ChatAnthropic
from veilus import Veilus

URL = "https://example.com"


async def main() -> None:
    veilus = Veilus()
    profile = (await veilus.list_profiles())[0]
    cdp_url = profile.get("cdpUrl") or (await veilus.launch(profile["id"]))["cdpUrl"]

    # keep_alive: leave the profile running; no_viewport: never resize its tabs.
    browser = Browser(
        cdp_url=cdp_url, keep_alive=True, headless=False, no_viewport=True
    )
    # browser-use forces tool_choice; claude-haiku-5-5 accepts that, while
    # claude-sonnet-5-5 and claude-opus-5-5 answer HTTP 400.
    llm = ChatAnthropic(
        model=os.environ.get("VEILUS_EXAMPLE_MODEL", "claude-haiku-5-5")
    )
    agent = Agent(
        task=f"Open {URL}. Reply with the exact page title only, no quotes or punctuation.",
        llm=llm,
        browser=browser,
    )
    history = await agent.run(max_steps=5)
    print((history.final_result() or "").strip().strip("\"'."))


asyncio.run(main())
```

Đặt `ANTHROPIC_API_KEY` cho model. `keep_alive=True` để browser-use không đóng trình duyệt của hồ sơ khi agent xong việc. `cdpUrl` đổi mỗi lần hồ sơ khởi động, nên hãy đọc lại sau mỗi lần mở.

## Công cụ đã chạy thử trên hồ sơ thật

Ngày 14/10/2026, chúng tôi chạy mỗi công cụ dưới đây một ví dụ trên một hồ sơ Veilus ở macOS. Mỗi ví dụ mở một trang, đọc tiêu đề rồi để hồ sơ tiếp tục chạy. Cả mười đều đạt:

| Công cụ | Phiên bản đã thử |
|---|---|
| Playwright | playwright-core 1.64.0 |
| Puppeteer | puppeteer-core 25.13.0 |
| playwright-mcp | @playwright/mcp 0.0.83 |
| agent-browser | agent-browser 0.39.1 |
| Crawl4AI | crawl4ai 0.9.4 |
| LangChain | langchain-community 0.4.2 |
| Scrapling | scrapling 0.4.6 |
| Crawlee | crawlee 1.10.4 |
| browser-use | browser-use 0.13.11 |
| Stagehand | @browserbasehq/stagehand 3.7.3 |

Các ví dụ và bảng này, kèm phiên bản và ngày, nằm ở [examples/TESTED.md](https://github.com/veilus/sdk/blob/main/examples/TESTED.md). Bản mới của một công cụ có thể đổi hành vi; bảng cho biết đã chạy gì, không hứa sẽ chạy gì. Ghi chú theo từng công cụ có ở công thức [Use a Profile from Other Tools](https://docs.veilus.io/recipes/agent-frameworks/).

## Chuột và gõ phím giống người

Script bạn viết bằng Playwright tự điều khiển chuột và bàn phím. Nếu bạn muốn đường đi chuột, cú cuộn con lăn và nhịp gõ giống người trong tự động hoá của riêng mình, chúng tôi đã công khai các mô hình đứng sau công cụ click, type và scroll của Veilus thành một crate Rust mã nguồn mở, [`veilus-human-input`](https://crates.io/crates/veilus-human-input) (MIT hoặc Apache-2.0). Mọi hàm đều thuần: nhận tham số và bộ sinh số ngẫu nhiên, trả về các điểm, delta con lăn và khoảng thời gian; gửi chúng tới trình duyệt là việc của bạn.

Chúng tôi so tham số mặc định của crate với một người trên một trang: 20 cú click, ba câu gõ và một lần cuộn dài. Với tham số mặc định giữ nguyên, bộ phân loại kiểm chéo tách được chuột trong mọi lần (1,00; 0,5 nghĩa là nó không phân biệt được hai bên). Sau khi đặt `tick`, khoảng cách giữa các sự kiện con trỏ, bằng chu kỳ báo của con chuột đã ghi, điểm chuột là 0,38 ± 0,14 và điểm bàn phím là 0,59 ± 0,05. Đó là một phiên của một người, trên macOS, với chuột có con lăn, nên hãy đọc là "gần với người này", không phải "gần với mọi người". Hãy đặt `tick` theo thiết bị bạn đang mô phỏng trước tiên. Chi tiết ở [trang docs](https://docs.veilus.io/reference/human-input/) và [bài giới thiệu crate](/blog/veilus-human-input-rust-crate-vi/).

## Điều này không làm được gì

Một công cụ đang kết nối vẫn là một công cụ đang kết nối. Veilus giữ danh tính của hồ sơ; nó không thể che việc có một client tự động hoá đang điều khiển trang khi client đó còn gắn vào. SDK cho agent của bạn một trình duyệt có danh tính nhất quán để làm việc. Nó không đổi việc agent làm ở đó, và không quyết định một trang web đối xử với lưu lượng ấy ra sao.
