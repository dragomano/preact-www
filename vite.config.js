import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

import { precompileMarkdown } from './plugins/precompile-markdown/index.js';
import { netlifyPlugin } from './plugins/netlify.js';
import { spaFallbackMiddlewarePlugin } from './plugins/spa-fallback-middleware.js';
import { htmlRoutingMiddlewarePlugin } from './plugins/html-routing-middleware.js';
import { rssFeedPlugin } from './plugins/rss-feed.js';

// TODO: Should we do this for all routes, rely on discovery a bit less?
import { tutorialRoutes } from './src/lib/route-utils.js';

export default defineConfig({
	publicDir: 'src/assets',
	optimizeDeps: {
		include: ['@babel/polyfill', '@rollup/browser', 'sucrase']
	},
	build: {
		target: ['chrome88', 'edge88', 'es2020', 'firefox78', 'safari14'],
		outDir: 'build'
	},
	define: {
		'process.env.BRANCH': JSON.stringify(process.env.BRANCH)
	},
	plugins: [
		preact({
			prerender: {
				enabled: true,
				renderTarget: '#app',
				// The routes that will not be discovered automatically
				additionalPrerenderRoutes: [
					'/404',
					'/guide/v8/getting-started',
					'/branding',
					...Object.keys(tutorialRoutes)
				]
			}
		}),
		viteStaticCopy({
			hook: 'generateBundle',
			targets: [
				{
					src: './content/**/*.md',
					dest: './',
					rename: (_name, _fileExtension, fullPath) => path.basename(fullPath).replace(/\.md$/, '.json'),
					transform: precompileMarkdown
				}
			],
			structured: true,
			watch: {
				reloadPageOnChange: true
			}
		}),
		netlifyPlugin(),
		spaFallbackMiddlewarePlugin(),
		htmlRoutingMiddlewarePlugin(),
		rssFeedPlugin()
	]
});
