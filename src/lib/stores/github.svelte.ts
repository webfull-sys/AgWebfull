/**
 * AgWebfull — Store de GitHub (Svelte 5 runes) — Stub Web
 * Na versão web, GitHub OAuth é stubado
 * @author Webfull (https://webfull.com.br)
 */

let authenticated = $state(false);
let username = $state<string | null>(null);
let loading = $state(false);

export function isGithubAuthenticated(): boolean { return authenticated; }
export function getGithubUsername(): string | null { return username; }
export function isGithubLoading(): boolean { return loading; }

/** Stub — GitHub OAuth Device Flow não disponível na web */
export async function startDeviceFlow(): Promise<{ message: string }> {
	return { message: 'Integração GitHub OAuth requer o aplicativo desktop. Na versão web, o catálogo é acessado diretamente.' };
}

export async function logout(): Promise<void> {
	authenticated = false;
	username = null;
}
