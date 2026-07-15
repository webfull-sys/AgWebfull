/**
 * AgWebfull — Tipos TypeScript
 * Baseado no agency-agents-app (MIT) por Michael Sitarzewski
 * Tipos centrais para agentes, ferramentas, instalações e UI
 * @author Webfull (https://webfull.com.br)
 */

/** Divisão/Categoria do catálogo de agentes */
export interface Division {
	id: string;
	label: string;
	icon: string;
	color: string;
	count?: number;
}

/** Agente/persona do catálogo */
export interface Agent {
	slug: string;
	division: string;
	title: string;
	category: string;
	description?: string;
	content?: string;
	tags?: string[];
	wordCount?: number;
	installState?: InstallState;
}

/** Ferramenta suportada (Claude Code, Cursor, etc.) */
export interface Tool {
	id: string;
	label: string;
	short: string;
	kebab: string;
	accent: string;
	icon: string;
	order: number;
	scope: { user: boolean; project: boolean };
	detect?: { dirs: string[]; agentsDir: string };
	version?: { bin: string; args: string[] };
	format: string;
	installKind: 'per-agent' | 'roster' | 'plugin';
	slugFrom?: string;
	dest?: { user: string[]; project: string[] };
	detected?: boolean;
	installedCount?: number;
	versionString?: string;
}

/** Estado de instalação de um agente */
export type InstallStatus = 'current' | 'outdated' | 'modified' | 'removed' | 'foreign' | 'not-installed';

export interface InstallState {
	status: InstallStatus;
	toolId?: string;
	scope?: 'user' | 'project';
	installedAt?: string;
	path?: string;
}

/** Registro de instalação no ledger */
export interface InstallRecord {
	agentSlug: string;
	toolId: string;
	scope: 'user' | 'project';
	path: string;
	installedAt: string;
	sourceHash?: string;
	renderedHash?: string;
	projectPath?: string;
}

/** Time/equipe de agentes */
export interface Team {
	id: string;
	name: string;
	description?: string;
	agents: string[];
	isBuiltIn: boolean;
	createdAt?: string;
	updatedAt?: string;
}

/** Projeto com agentes instalados */
export interface Project {
	id: string;
	name: string;
	path: string;
	tools: string[];
	agents: string[];
	lastSeen?: string;
}

/** Item de atividade/histórico */
export interface ActivityItem {
	id: string;
	type: 'install' | 'uninstall' | 'update' | 'reconcile' | 'info';
	agentSlug?: string;
	toolId?: string;
	message: string;
	timestamp: string;
	details?: string;
}

/** Configurações do app */
export interface AppSettings {
	theme: 'dark' | 'light' | 'system';
	catalogSource: 'bundled' | 'remote';
	catalogUrl: string;
	sidebarCollapsed: boolean;
	autoUpdate: boolean;
	locale: string;
	showWelcome: boolean;
}

/** Toast notification */
export interface ToastMessage {
	id: string;
	type: 'success' | 'error' | 'warning' | 'info';
	message: string;
	duration?: number;
}

/** Abas da navegação principal */
export type MainTab = 'dashboard' | 'agents' | 'tools' | 'teams' | 'projects' | 'settings';

/** Filtros do workspace de agentes */
export interface AgentFilters {
	search: string;
	division: string | null;
	category: string | null;
	installStatus: InstallStatus | 'all';
}

/** Dados do Dashboard */
export interface DashboardData {
	totalAgents: number;
	installedAgents: number;
	totalTools: number;
	detectedTools: number;
	healthBreakdown: { status: InstallStatus; count: number }[];
	divisionCoverage: { division: string; total: number; installed: number }[];
}

/** Resultado de reconciliação */
export interface ReconcileResult {
	current: number;
	outdated: number;
	modified: number;
	removed: number;
	foreign: number;
}

/** Runbook (guia de uso de agentes) */
export interface Runbook {
	id: string;
	title: string;
	content: string;
	agents: string[];
	tools: string[];
}

/** Estado da UI global */
export interface UIState {
	activeTab: MainTab;
	selectedAgent: string | null;
	selectedTool: string | null;
	selectedTeam: string | null;
	selectedProject: string | null;
	sidebarCollapsed: boolean;
	commandPaletteOpen: boolean;
	modalStack: string[];
}
