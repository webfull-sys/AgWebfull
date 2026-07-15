import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

/**
 * Configuração Vite para AgWebfull
 * Baseado no agency-agents-app (MIT) — adaptado para SaaS web
 * @author Webfull (https://webfull.com.br)
 */
export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		host: true
	},
	preview: {
		port: 4173,
		host: true
	}
});
