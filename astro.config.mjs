// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

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
				// Add lastmod for crawl priority
				item.lastmod = new Date().toISOString();
				return item;
			},
		}),
	],
});
