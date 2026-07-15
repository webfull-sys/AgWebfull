/**
 * AgWebfull — Camada de API Web
 * Substitui as chamadas Tauri invoke() por equivalentes web
 * (localStorage, fetch estático, stubs para recursos desktop)
 * @author Webfull (https://webfull.com.br)
 */

import { isBrowser, DESKTOP_ONLY_MESSAGE } from './platform';
import type { Agent, Tool, Division, InstallRecord, AppSettings, ActivityItem, Team, Project, ReconcileResult } from './types';
import toolsData from './data/tools.json';
import categoriesData from './data/categories.json';

// ---------- Constantes ----------
const STORAGE_PREFIX = 'agwebfull_';
const INSTALL_LEDGER_KEY = `${STORAGE_PREFIX}installs`;
const SETTINGS_KEY = `${STORAGE_PREFIX}settings`;
const ACTIVITY_KEY = `${STORAGE_PREFIX}activity`;
const TEAMS_KEY = `${STORAGE_PREFIX}teams`;
const PROJECTS_KEY = `${STORAGE_PREFIX}projects`;

// ---------- Helpers de Storage ----------

/** Lê dados do localStorage de forma segura */
function storageGet<T>(key: string, fallback: T): T {
	if (!isBrowser()) return fallback;
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}

/** Grava dados no localStorage de forma segura */
function storageSet<T>(key: string, value: T): void {
	if (!isBrowser()) return;
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		console.warn('[AgWebfull] Falha ao gravar localStorage:', e);
	}
}

// ---------- Catálogo de Agentes ----------

/** Índice estático de agentes de amostra */
const SAMPLE_AGENTS: Agent[] = [
	{ slug: 'engineering-ai-engineer', division: 'engineering', title: 'AI Engineer', category: 'Engineering', description: 'Specializes in AI/ML systems, model architecture, training pipelines, and deployment.' },
	{ slug: 'engineering-backend-architect', division: 'engineering', title: 'Backend Architect', category: 'Engineering', description: 'Expert in distributed systems, API design, database architecture, and scalable infrastructure.' },
	{ slug: 'engineering-frontend-engineer', division: 'engineering', title: 'Frontend Engineer', category: 'Engineering', description: 'Builds responsive, accessible, and performant web interfaces with modern frameworks.' },
	{ slug: 'engineering-devops-engineer', division: 'engineering', title: 'DevOps Engineer', category: 'Engineering', description: 'Manages CI/CD pipelines, infrastructure as code, container orchestration, and monitoring.' },
	{ slug: 'engineering-security-engineer', division: 'engineering', title: 'Security Engineer', category: 'Engineering', description: 'Identifies vulnerabilities, implements security controls, and hardens applications.' },
	{ slug: 'engineering-database-engineer', division: 'engineering', title: 'Database Engineer', category: 'Engineering', description: 'Designs schemas, optimizes queries, manages migrations, and ensures data integrity.' },
	{ slug: 'engineering-performance-engineer', division: 'engineering', title: 'Performance Engineer', category: 'Engineering', description: 'Profiles, benchmarks, and optimizes application performance across the stack.' },
	{ slug: 'design-ui-designer', division: 'design', title: 'UI Designer', category: 'Design', description: 'Creates beautiful, consistent, and intuitive user interfaces with design system principles.' },
	{ slug: 'design-ux-architect', division: 'design', title: 'UX Architect', category: 'Design', description: 'Structures information architecture, user flows, and interaction patterns.' },
	{ slug: 'design-ux-researcher', division: 'design', title: 'UX Researcher', category: 'Design', description: 'Conducts user research, usability testing, and synthesizes insights into design decisions.' },
	{ slug: 'design-brand-guardian', division: 'design', title: 'Brand Guardian', category: 'Design', description: 'Maintains brand consistency across products, ensuring visual and verbal identity.' },
	{ slug: 'product-product-manager', division: 'product', title: 'Product Manager', category: 'Product', description: 'Defines product strategy, manages roadmaps, and balances user needs with business goals.' },
	{ slug: 'product-product-analyst', division: 'product', title: 'Product Analyst', category: 'Product', description: 'Analyzes user behavior, defines metrics, and provides data-driven product insights.' },
	{ slug: 'management-engineering-manager', division: 'management', title: 'Engineering Manager', category: 'Management', description: 'Leads engineering teams, manages technical projects, and facilitates team growth.' },
	{ slug: 'management-scrum-master', division: 'management', title: 'Scrum Master', category: 'Management', description: 'Facilitates agile ceremonies, removes blockers, and coaches teams on agile practices.' },
	{ slug: 'marketing-content-strategist', division: 'marketing', title: 'Content Strategist', category: 'Marketing', description: 'Plans and creates content that drives engagement, SEO, and brand awareness.' },
	{ slug: 'finance-financial-analyst', division: 'finance', title: 'Financial Analyst', category: 'Finance', description: 'Builds financial models, forecasts revenue, and analyzes business performance.' },
	{ slug: 'research-data-scientist', division: 'research', title: 'Data Scientist', category: 'Research', description: 'Applies statistical methods, machine learning, and data analysis to solve complex problems.' },
	{ slug: 'strategy-business-strategist', division: 'strategy', title: 'Business Strategist', category: 'Strategy', description: 'Develops competitive strategies, market analysis, and growth frameworks.' },
	{ slug: 'legal-compliance-officer', division: 'legal', title: 'Compliance Officer', category: 'Legal', description: 'Ensures regulatory compliance, data privacy (GDPR/CCPA), and risk management.' },
	{ slug: 'operations-systems-administrator', division: 'operations', title: 'Systems Administrator', category: 'Operations', description: 'Manages servers, networks, and infrastructure reliability.' },
	{ slug: 'academic-historian', division: 'academic', title: 'Historian', category: 'Academic', description: 'Provides historical context, research methodologies, and archival analysis.' },
	{ slug: 'game-development-game-designer', division: 'game-development', title: 'Game Designer', category: 'Game Development', description: 'Designs game mechanics, level design, balancing, and player experience systems.' },
];

/** Busca a lista de agentes do catálogo */
export async function listAgents(): Promise<Agent[]> {
	return [...SAMPLE_AGENTS];
}

/** Busca um agente pelo slug */
export async function getAgent(slug: string): Promise<Agent | null> {
	const agent = SAMPLE_AGENTS.find(a => a.slug === slug);
	if (!agent) return null;
	// Gera conteúdo markdown de exemplo se não tiver
	if (!agent.content) {
		agent.content = generateSampleContent(agent);
	}
	return { ...agent };
}

/** Gera conteúdo markdown de exemplo para um agente */
function generateSampleContent(agent: Agent): string {
	return `# ${agent.title}

## Role
You are a **${agent.title}** — a specialized AI agent persona from the Agency Agents catalog.

## Division
**${agent.category}** — ${agent.description || 'Specialized professional agent.'}

## Core Competencies
- Deep expertise in ${agent.category.toLowerCase()} domain
- Structured problem-solving and analytical thinking
- Clear communication and documentation
- Best practices and industry standards

## Working Style
- Ask clarifying questions before starting work
- Break complex tasks into manageable steps
- Provide reasoning for decisions and recommendations
- Cite sources and reference materials when applicable

## Interaction Guidelines
1. Be thorough but concise in responses
2. Prioritize accuracy over speed
3. Flag uncertainties and assumptions
4. Suggest improvements proactively

---
*Agent persona from [agency-agents](https://github.com/msitarzewski/agency-agents) catalog.*
*Served by AgWebfull — [webfull.com.br](https://webfull.com.br)*
`;
}

// ---------- Ferramentas ----------

/** Retorna a lista de ferramentas suportadas */
export async function getTools(): Promise<Tool[]> {
	const tools = toolsData.tools as Record<string, Omit<Tool, 'detected' | 'installedCount' | 'versionString'>>;
	return Object.values(tools).map(t => ({
		...t,
		detected: false,
		installedCount: 0,
		versionString: undefined,
	})) as Tool[];
}

// ---------- Categorias/Divisões ----------

/** Retorna as divisões do catálogo */
export async function getDivisions(): Promise<Division[]> {
	const cats = categoriesData.categories as Record<string, { label: string; icon: string; color: string }>;
	const agents = SAMPLE_AGENTS;
	return Object.entries(cats).map(([id, cat]) => ({
		id,
		...cat,
		count: agents.filter(a => a.division === id).length,
	}));
}

// ---------- Instalação (Stubs Web) ----------

/** Retorna registros de instalação do localStorage */
export async function getInstallRecords(): Promise<InstallRecord[]> {
	return storageGet<InstallRecord[]>(INSTALL_LEDGER_KEY, []);
}

/** Simula instalação de um agente (salva no localStorage + copia conteúdo) */
export async function installAgent(agentSlug: string, toolId: string, scope: 'user' | 'project'): Promise<{ success: boolean; message: string; content?: string }> {
	const agent = await getAgent(agentSlug);
	if (!agent) return { success: false, message: 'Agente não encontrado.' };

	const records = await getInstallRecords();
	const existingIdx = records.findIndex(r => r.agentSlug === agentSlug && r.toolId === toolId && r.scope === scope);

	const record: InstallRecord = {
		agentSlug,
		toolId,
		scope,
		path: `~/.${toolId}/agents/${agentSlug}.md`,
		installedAt: new Date().toISOString(),
		sourceHash: btoa(agentSlug).slice(0, 8),
	};

	if (existingIdx >= 0) {
		records[existingIdx] = record;
	} else {
		records.push(record);
	}

	storageSet(INSTALL_LEDGER_KEY, records);
	addActivity({ type: 'install', agentSlug, toolId, message: `Agente "${agent.title}" marcado para ${toolId}` });

	return {
		success: true,
		message: `✅ Conteúdo do agente "${agent.title}" pronto para copiar. Na versão web, cole no diretório do ${toolId}.`,
		content: agent.content,
	};
}

/** Remove registro de instalação */
export async function uninstallAgent(agentSlug: string, toolId: string, scope: 'user' | 'project'): Promise<boolean> {
	const records = await getInstallRecords();
	const filtered = records.filter(r => !(r.agentSlug === agentSlug && r.toolId === toolId && r.scope === scope));
	storageSet(INSTALL_LEDGER_KEY, filtered);
	addActivity({ type: 'uninstall', agentSlug, toolId, message: `Agente "${agentSlug}" removido do registro de ${toolId}` });
	return true;
}

/** Reconcilia estado de instalações (stub: retorna tudo como current) */
export async function reconcile(): Promise<ReconcileResult> {
	const records = await getInstallRecords();
	return {
		current: records.length,
		outdated: 0,
		modified: 0,
		removed: 0,
		foreign: 0,
	};
}

// ---------- Configurações ----------

const DEFAULT_SETTINGS: AppSettings = {
	theme: 'dark',
	catalogSource: 'bundled',
	catalogUrl: 'https://github.com/msitarzewski/agency-agents',
	sidebarCollapsed: false,
	autoUpdate: false,
	locale: 'en',
	showWelcome: true,
};

/** Carrega configurações do localStorage */
export async function getSettings(): Promise<AppSettings> {
	return storageGet<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
}

/** Salva configurações no localStorage */
export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
	const current = await getSettings();
	const merged = { ...current, ...settings };
	storageSet(SETTINGS_KEY, merged);
	return merged;
}

// ---------- Atividade ----------

/** Adiciona item de atividade ao histórico */
function addActivity(item: Omit<ActivityItem, 'id' | 'timestamp'>): void {
	const items = storageGet<ActivityItem[]>(ACTIVITY_KEY, []);
	items.unshift({
		...item,
		id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
		timestamp: new Date().toISOString(),
	});
	// Manter apenas os últimos 100
	storageSet(ACTIVITY_KEY, items.slice(0, 100));
}

/** Retorna histórico de atividades */
export async function getActivityHistory(): Promise<ActivityItem[]> {
	return storageGet<ActivityItem[]>(ACTIVITY_KEY, []);
}

// ---------- Teams ----------

const BUILT_IN_TEAMS: Team[] = [
	{ id: 'full-stack', name: 'Full Stack Team', description: 'Frontend + Backend + DevOps', agents: ['engineering-frontend-engineer', 'engineering-backend-architect', 'engineering-devops-engineer'], isBuiltIn: true },
	{ id: 'product-squad', name: 'Product Squad', description: 'PM + Designer + Analyst', agents: ['product-product-manager', 'design-ui-designer', 'product-product-analyst'], isBuiltIn: true },
	{ id: 'security-team', name: 'Security Team', description: 'Security + Compliance', agents: ['engineering-security-engineer', 'legal-compliance-officer'], isBuiltIn: true },
];

/** Retorna times (built-in + custom) */
export async function getTeams(): Promise<Team[]> {
	const custom = storageGet<Team[]>(TEAMS_KEY, []);
	return [...BUILT_IN_TEAMS, ...custom];
}

/** Salva um time custom */
export async function saveTeam(team: Team): Promise<void> {
	const custom = storageGet<Team[]>(TEAMS_KEY, []);
	const idx = custom.findIndex(t => t.id === team.id);
	if (idx >= 0) custom[idx] = team;
	else custom.push(team);
	storageSet(TEAMS_KEY, custom);
}

/** Remove um time custom */
export async function deleteTeam(teamId: string): Promise<void> {
	const custom = storageGet<Team[]>(TEAMS_KEY, []);
	storageSet(TEAMS_KEY, custom.filter(t => t.id !== teamId));
}

// ---------- Projects (Stub) ----------

/** Retorna projetos (stub: lista vazia na web) */
export async function getProjects(): Promise<Project[]> {
	return storageGet<Project[]>(PROJECTS_KEY, []);
}

// ---------- Utilitários ----------

/** Abre URL externa */
export function openExternal(url: string): void {
	if (isBrowser()) window.open(url, '_blank', 'noopener,noreferrer');
}

/** Copia texto para clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
	if (!isBrowser()) return false;
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		// Fallback para browsers antigos
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		const ok = document.execCommand('copy');
		document.body.removeChild(textarea);
		return ok;
	}
}

/** Versão do app */
export function getAppVersion(): string {
	return '0.1.0';
}

/** Nome do app */
export function getAppName(): string {
	return 'AgWebfull';
}
