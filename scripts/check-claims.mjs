/**
 * Cổng cụm từ cấm của blog (VEIL-1054). Chạy sau `npm run build`: `npm run check:claims`, tức
 * `node scripts/check-claims.mjs dist`. Quét mọi file .html, .xml (gồm rss.xml và sitemap) và .txt dưới thư mục
 * truyền vào: plain() bỏ thẻ, hits() so với BANNED của claims.js (bản chép từ website). Có chỗ trúng thì in từng
 * chỗ và thoát 1. deploy.yml chạy cổng này trước bước upload, nên chữ vi phạm không lên blog.veilus.io.
 *
 * KHÔNG ĐO:
 * - nghĩa của câu: chỉ đo chữ khớp mẫu trong HTML/XML/TXT đã build. Câu sai nằm ngoài danh sách mẫu, hay diễn đạt
 *   kiểu khác ("undetected", "nhanh gấp ba"), thì lọt;
 * - thuộc tính của thẻ: plain() bỏ nguyên thẻ, nên alt ảnh, meta description, og:/twitter:, title="" và href không
 *   được kiểm. Mô tả bài vẫn được quét ở chỗ nó hiện thành chữ: trang danh sách, JSON-LD của bài, rss.xml;
 * - chữ trong ảnh, chữ sinh lúc chạy bằng JS, và file đuôi khác (.js, .json, .svg, ảnh);
 * - thực thể HTML (&#39;, &amp;) không được giải mã: mẫu có dấu nháy thẳng có thể lọt ở chỗ Astro mã hoá dấu nháy;
 * - mẫu số co lại: cổng chỉ đỏ khi không quét được file nào. Số file quét được in ở dòng tổng để thấy khi nó tụt;
 * - lúc nào chạy: deploy.yml chỉ chạy khi push main hoặc chạy tay; nhánh khác không bị chặn.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { hits, plain } from './claims.js';

/**
 * Câu ĐÚNG mà một mẫu bắt nhầm, nguyên văn như chữ đã qua plain(); mỗi mục { text, why }. Mục nào không còn trong
 * file nào của thư mục build thì cổng đỏ, để danh sách không mục. Câu khẳng định sai thì sửa chữ, không khai ở đây.
 */
const ALLOWED = [];

const dir = process.argv[2];
if (!dir) {
  console.error('cách dùng: node scripts/check-claims.mjs <thư mục build>');
  process.exit(2);
}

const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]));
const pages = walk(dir)
  .filter((f) => /\.(html|xml|txt)$/.test(f))
  .sort()
  .map((f) => ({ file: relative(dir, f), text: plain(readFileSync(f, 'utf8')) }));
if (pages.length === 0) {
  console.error(`check-claims: không có file .html/.xml/.txt nào dưới ${dir} — build chưa chạy?`);
  process.exit(1);
}

const stale = ALLOWED.filter((a) => !pages.some((p) => p.text.includes(a.text)));
const found = pages.flatMap((p) =>
  hits(ALLOWED.reduce((t, a) => t.split(a.text).join(''), p.text)).map((h) => ({ ...h, file: p.file })),
);

for (const h of found) console.log(`${h.file}: [${h.id}] ${JSON.stringify(h.match)}`);
for (const a of stale) console.log(`ALLOWED: ${JSON.stringify(a.text)} không còn trong ${dir}, gỡ mục này`);
const dirty = new Set(found.map((h) => h.file)).size;
console.log(
  `check-claims: ${found.length} chỗ trúng trong ${dirty}/${pages.length} file .html/.xml/.txt dưới ${dir}` +
    (stale.length ? `; ${stale.length} mục ALLOWED không còn dùng` : ''),
);
process.exit(found.length || stale.length ? 1 : 0);
