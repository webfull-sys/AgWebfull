// SvelteKit config — híbrido: adapter-static (Tauri) e adapter-node (Web/SaaS)
// Baseado no agency-agents-app (MIT)
import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const isTauri = process.env.TAURI_ENV_PLATFORM !== undefined || process.env.TAURI_PLATFORM !== undefined;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: isTauri 
			? adapterStatic({ fallback: 'index.html' }) 
			: adapterNode({ out: 'build', precompress: true }),
		alias: {
			$lib: 'src/lib'
		}
	}
};

export default config;
