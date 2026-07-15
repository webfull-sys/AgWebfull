/**
 * AgWebfull — Store de UI Global (Svelte 5 runes)
 * Gerencia estado de navegação, seleção e modais
 * @author Webfull (https://webfull.com.br)
 */

import type { MainTab, UIState } from '$lib/types';

// Estado reativo global da UI
let activeTab = $state<MainTab>('dashboard');
let selectedAgent = $state<string | null>(null);
let selectedTool = $state<string | null>(null);
let selectedTeam = $state<string | null>(null);
let selectedProject = $state<string | null>(null);
let sidebarCollapsed = $state(false);
let commandPaletteOpen = $state(false);
let modalStack = $state<string[]>([]);
let detailPanelWidth = $state(380);

/** Retorna o estado completo da UI */
export function getUIState(): UIState {
	return {
		activeTab,
		selectedAgent,
		selectedTool,
		selectedTeam,
		selectedProject,
		sidebarCollapsed,
		commandPaletteOpen,
		modalStack,
	};
}

// ---------- Navegação ----------

export function setActiveTab(tab: MainTab): void {
	activeTab = tab;
	// Limpar seleções ao trocar de aba
	selectedAgent = null;
	selectedTool = null;
	selectedTeam = null;
	selectedProject = null;
}

export function getActiveTab(): MainTab {
	return activeTab;
}

// ---------- Seleção ----------

export function selectAgent(slug: string | null): void {
	selectedAgent = slug;
}

export function getSelectedAgent(): string | null {
	return selectedAgent;
}

export function selectTool(id: string | null): void {
	selectedTool = id;
}

export function getSelectedTool(): string | null {
	return selectedTool;
}

export function selectTeam(id: string | null): void {
	selectedTeam = id;
}

export function getSelectedTeam(): string | null {
	return selectedTeam;
}

export function selectProject(id: string | null): void {
	selectedProject = id;
}

export function getSelectedProject(): string | null {
	return selectedProject;
}

// ---------- Sidebar ----------

export function toggleSidebar(): void {
	sidebarCollapsed = !sidebarCollapsed;
}

export function getSidebarCollapsed(): boolean {
	return sidebarCollapsed;
}

export function setSidebarCollapsed(collapsed: boolean): void {
	sidebarCollapsed = collapsed;
}

// ---------- Command Palette ----------

export function toggleCommandPalette(): void {
	commandPaletteOpen = !commandPaletteOpen;
}

export function getCommandPaletteOpen(): boolean {
	return commandPaletteOpen;
}

export function setCommandPaletteOpen(open: boolean): void {
	commandPaletteOpen = open;
}

// ---------- Modais ----------

export function pushModal(id: string): void {
	if (!modalStack.includes(id)) {
		modalStack = [...modalStack, id];
	}
}

export function popModal(): string | undefined {
	const last = modalStack[modalStack.length - 1];
	modalStack = modalStack.slice(0, -1);
	return last;
}

export function closeModal(id: string): void {
	modalStack = modalStack.filter(m => m !== id);
}

export function isModalOpen(id: string): boolean {
	return modalStack.includes(id);
}

export function getModalStack(): string[] {
	return modalStack;
}

// ---------- Detail Panel ----------

export function setDetailPanelWidth(width: number): void {
	detailPanelWidth = Math.max(280, Math.min(600, width));
}

export function getDetailPanelWidth(): number {
	return detailPanelWidth;
}
