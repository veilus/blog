# blog — blog Veilus

> Quy trình làm việc chung (Superpowers + Plane): `../CLAUDE.md`.
> Nhãn Plane cho repo này: **`repo:blog`**.

## Repo này là gì

Astro, chạy ở **blog.veilus.io** (xem `CNAME`). Có `.github/workflows/deploy.yml`.

```
src/content/   bài viết
public/
```

```bash
npm run dev
npm run build
npm run preview
```

## Repo này CÔNG KHAI — hai hệ quả

**1. Không bao giờ đăng ký self-hosted runner cho repo này.** Runner Windows của Veilus đăng ký riêng cho `veilus/veilus`. Thêm nó vào repo công khai nghĩa là pull request từ fork bất kỳ chạy được code tuỳ ý trên máy cá nhân.

**2. Bài viết là phát ngôn ra thị trường.** Đối thủ đọc, và người dùng dẫn lại. Không viết ra: chi tiết patch fingerprint, lộ trình chưa chốt, số liệu kinh doanh, tên khách hàng.

## Viết về kỹ thuật thì phải đúng

Blog là nơi dễ khoe quá tay nhất. Ba ràng buộc:

- Con số phải đo được. Nói "vượt 30/30 bài test dò tìm" thì phải có lượt chạy chứng minh, và ghi ngày — thứ đúng hôm nay có thể sai sau một lần Cloudflare cập nhật.
- Nói về cách tiếp cận (patch tầng C++ thay vì inject JS) thì được; nói cụ thể patch nào chạm API nào thì không. Đó là chỉ đường cho detector.
- So sánh với đối thủ phải kiểm được. Nêu tên sản phẩm khác kèm tuyên bố sai là rủi ro pháp lý thật.

Nguồn định vị: `../project-docs/OVERVIEW.md` mục 1. Nguồn thương hiệu và giọng điệu: `../marketing/`.

## Commit

Sửa ở đây phải commit **hai lần**: trong submodule này, rồi con trỏ ở repo gốc.
