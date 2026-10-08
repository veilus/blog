// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync } from 'node:fs';

// lastmod của /blog/<slug>/ lấy từ frontmatter (updatedDate, không có thì pubDate); trang khác không có lastmod.
// Trước đây mọi URL mang new Date() của lượt build — lastmod luôn bằng giờ build thì Google bỏ qua (VEIL-1318).
const frontmatterDate = (src, key) => src.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)`, 'm'))?.[1];
const postDates = Object.fromEntries(
	readdirSync('src/content/blog')
		.filter((f) => /\.mdx?$/.test(f))
		.map((f) => {
			const src = readFileSync(`src/content/blog/${f}`, 'utf8');
			return [f.replace(/\.mdx?$/, ''), new Date(frontmatterDate(src, 'updatedDate') ?? frontmatterDate(src, 'pubDate'))];
		}),
);

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.veilus.io',
	// Bài so sánh với đối thủ đã gỡ (VEIL-1054). GitHub Pages không có 301: build tĩnh sinh trang meta refresh
	// kèm canonical tới đích.
	redirects: {
		'/blog/anti-detect-browser-comparison-2026': '/blog/what-is-anti-detect-browser/',
	},
	integrations: [
		mdx(),
		sitemap({
			serialize(item) {
				const slug = new URL(item.url).pathname.match(/^\/blog\/([^/]+)\/?$/)?.[1];
				const date = slug && postDates[slug];
				return date && !Number.isNaN(date.getTime()) ? { ...item, lastmod: date.toISOString() } : item;
			},
		}),
	],
});
