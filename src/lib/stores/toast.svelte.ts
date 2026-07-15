/**
 * AgWebfull — Store de Toast Notifications (Svelte 5 runes)
 * @author Webfull (https://webfull.com.br)
 */

import type { ToastMessage } from '$lib/types';

let toasts = $state<ToastMessage[]>([]);

export function getToasts(): ToastMessage[] {
	return toasts;
}

export function addToast(type: ToastMessage['type'], message: string, duration = 4000): void {
	const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
	toasts = [...toasts, { id, type, message, duration }];
	if (duration > 0) {
		setTimeout(() => removeToast(id), duration);
	}
}

export function removeToast(id: string): void {
	toasts = toasts.filter(t => t.id !== id);
}

export function clearToasts(): void {
	toasts = [];
}

// Atalhos
export const toast = {
	success: (msg: string) => addToast('success', msg),
	error: (msg: string) => addToast('error', msg, 6000),
	warning: (msg: string) => addToast('warning', msg, 5000),
	info: (msg: string) => addToast('info', msg),
};
