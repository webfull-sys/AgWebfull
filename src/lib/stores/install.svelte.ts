/**
 * AgWebfull — Store de Instalação (Svelte 5 runes)
 * Gerencia o ledger de instalações via localStorage
 * @author Webfull (https://webfull.com.br)
 */

import type { InstallRecord, ReconcileResult } from '$lib/types';
import { getInstallRecords, installAgent as apiInstall, uninstallAgent as apiUninstall, reconcile as apiReconcile } from '$lib/api';

let records = $state<InstallRecord[]>([]);
let loading = $state(false);
let reconcileResult = $state<ReconcileResult | null>(null);

export async function loadInstalls(): Promise<void> {
	loading = true;
	try { records = await getInstallRecords(); }
	finally { loading = false; }
}

export async function install(agentSlug: string, toolId: string, scope: 'user' | 'project' = 'user') {
	const result = await apiInstall(agentSlug, toolId, scope);
	await loadInstalls();
	return result;
}

export async function uninstall(agentSlug: string, toolId: string, scope: 'user' | 'project' = 'user') {
	await apiUninstall(agentSlug, toolId, scope);
	await loadInstalls();
}

export async function runReconcile(): Promise<ReconcileResult> {
	const r = await apiReconcile();
	reconcileResult = r;
	return r;
}

export function getRecords(): InstallRecord[] { return records; }
export function isInstallLoading(): boolean { return loading; }
export function getReconcileResult(): ReconcileResult | null { return reconcileResult; }

export function isAgentInstalled(slug: string, toolId?: string): boolean {
	return records.some(r => r.agentSlug === slug && (!toolId || r.toolId === toolId));
}

export function getAgentInstalls(slug: string): InstallRecord[] {
	return records.filter(r => r.agentSlug === slug);
}

export function getToolInstalls(toolId: string): InstallRecord[] {
	return records.filter(r => r.toolId === toolId);
}
