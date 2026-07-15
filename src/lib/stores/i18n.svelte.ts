/**
 * AgWebfull — Store de i18n (Svelte 5 runes)
 * Internacionalização simplificada
 * @author Webfull (https://webfull.com.br)
 */

let locale = $state('en');

const strings: Record<string, Record<string, string>> = {
	en: {
		'app.name': 'AgWebfull',
		'nav.dashboard': 'Dashboard',
		'nav.agents': 'Agents',
		'nav.tools': 'Tools',
		'nav.teams': 'Teams',
		'nav.projects': 'Projects',
		'nav.settings': 'Settings',
		'agent.install': 'Install',
		'agent.uninstall': 'Remove',
		'agent.copy': 'Copy to Clipboard',
		'agent.preview': 'Preview',
		'agent.installed': 'Installed',
		'agent.notInstalled': 'Not Installed',
		'search.placeholder': 'Search agents...',
		'filter.all': 'All',
		'filter.division': 'Division',
		'filter.status': 'Status',
		'settings.theme': 'Theme',
		'settings.dark': 'Dark',
		'settings.light': 'Light',
		'settings.system': 'System',
		'settings.catalog': 'Catalog',
		'settings.about': 'About',
		'dashboard.health': 'Install Health',
		'dashboard.coverage': 'Coverage',
		'dashboard.agents': 'Total Agents',
		'dashboard.tools': 'Supported Tools',
		'empty.noAgents': 'No agents found',
		'empty.noResults': 'No results match your filters',
		'web.desktopOnly': 'This feature requires the desktop app',
		'web.copyHint': 'Copy the agent content and paste it into your tool\'s directory',
	}
};

export function t(key: string): string {
	return strings[locale]?.[key] ?? key;
}

export function setLocale(l: string): void { locale = l; }
export function getLocale(): string { return locale; }
