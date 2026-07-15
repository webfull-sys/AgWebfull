/**
 * AgWebfull — Detecção de Plataforma
 * Determina se o app está rodando na web ou como app desktop (Tauri)
 * Na versão web, sempre retorna false para Tauri
 * @author Webfull (https://webfull.com.br)
 */

/** Verifica se estamos rodando dentro do Tauri */
export function isTauri(): boolean {
	if (!isBrowser()) return false;
	// @ts-ignore
	return window.__TAURI_INTERNALS__ !== undefined;
}

/** Verifica se estamos no navegador (vs SSR) */
export function isBrowser(): boolean {
	return typeof window !== 'undefined';
}

/** Plataforma atual */
export type Platform = 'web' | 'desktop';

/** Retorna a plataforma atual */
export function getPlatform(): Platform {
	return isTauri() ? 'desktop' : 'web';
}

/** Verifica se um recurso desktop está disponível */
export function isDesktopFeatureAvailable(): boolean {
	return isTauri();
}

/** Mensagem padrão para recursos desktop indisponíveis */
export const DESKTOP_ONLY_MESSAGE = 'Este recurso requer o aplicativo desktop. Na versão web, utilize a opção de copiar para clipboard.';
