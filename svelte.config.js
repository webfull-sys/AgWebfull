// SvelteKit config — adapter-node para SaaS web
// Baseado no agency-agents-app (MIT) - adaptado de adapter-static para adapter-node
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true
		}),
		alias: {
			$lib: 'src/lib'
		}
	}
};

export default config;
