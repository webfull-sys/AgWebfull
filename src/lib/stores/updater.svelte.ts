/**
 * AgWebfull — Store de Updater (Svelte 5 runes) — Stub Web
 * Na versão web, auto-update não é necessário
 * @author Webfull (https://webfull.com.br)
 */

let updateAvailable = $state(false);
let updateVersion = $state<string | null>(null);
let checking = $state(false);

export function isUpdateAvailable(): boolean { return updateAvailable; }
export function getUpdateVersion(): string | null { return updateVersion; }
export function isChecking(): boolean { return checking; }

/** Stub — versão web é sempre a mais recente */
export async function checkForUpdates(): Promise<void> {
	// Na web, não há auto-update — o app sempre serve a versão mais recente
	updateAvailable = false;
}
