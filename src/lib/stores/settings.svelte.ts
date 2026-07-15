/**
 * AgWebfull — Store de Settings (Svelte 5 runes)
 * Gerencia configurações persistidas em localStorage
 * @author Webfull (https://webfull.com.br)
 */

import type { AppSettings } from '$lib/types';
import { getSettings, saveSettings } from '$lib/api';
import { isBrowser } from '$lib/platform';

let settings = $state<AppSettings>({
	theme: 'dark',
	catalogSource: 'bundled',
	catalogUrl: 'https://github.com/msitarzewski/agency-agents',
	sidebarCollapsed: false,
	autoUpdate: false,
	locale: 'en',
	showWelcome: true,
});
let loaded = $state(false);

/** Carrega settings do storage */
export async function loadSettings(): Promise<void> {
	if (loaded) return;
	settings = await getSettings();
	applyTheme(settings.theme);
	loaded = true;
}

/** Atualiza uma ou mais configurações */
export async function updateSettings(partial: Partial<AppSettings>): Promise<void> {
	settings = await saveSettings(partial);
	if (partial.theme) applyTheme(partial.theme);
}

/** Aplica o tema ao documento */
function applyTheme(theme: AppSettings['theme']): void {
	if (!isBrowser()) return;
	const resolved = theme === 'system'
		? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
		: theme;
	document.documentElement.setAttribute('data-theme', resolved);
}

export function getCurrentSettings(): AppSettings { return settings; }
export function isSettingsLoaded(): boolean { return loaded; }
export function getTheme(): AppSettings['theme'] { return settings.theme; }
