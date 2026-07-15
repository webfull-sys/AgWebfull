/// <reference types="@sveltejs/kit" />

/**
 * AgWebfull — Declarações de tipos globais
 * Baseado no agency-agents-app (MIT) por Michael Sitarzewski
 * Adaptado para SaaS web por Webfull (https://webfull.com.br)
 */

// See https://svelte.dev/docs/kit/types#app.d.ts
declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}
		interface Locals {}
		interface PageData {}
		interface PageState {}
		interface Platform {}
	}
}

export {};
