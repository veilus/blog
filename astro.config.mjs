// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.veilus.io',
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
