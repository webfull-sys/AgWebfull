/**
 * AgWebfull — Store de Catálogo de Agentes (Svelte 5 runes)
 * Gerencia a lista de agentes, filtros e carregamento
 * @author Webfull (https://webfull.com.br)
 */

import type { Agent, AgentFilters, Division } from '$lib/types';
import { listAgents, getDivisions, getAgent } from '$lib/api';

let agents = $state<Agent[]>([]);
let divisions = $state<Division[]>([]);
let loading = $state(false);
let loaded = $state(false);
let filters = $state<AgentFilters>({
	search: '',
	division: null,
	category: null,
	installStatus: 'all',
});

/** Carrega o catálogo de agentes e divisões */
export async function loadCatalog(): Promise<void> {
	if (loaded) return;
	loading = true;
	try {
		const [agentList, divList] = await Promise.all([listAgents(), getDivisions()]);
		agents = agentList;
		divisions = divList;
		loaded = true;
	} catch (e) {
		console.error('[AgWebfull] Falha ao carregar catálogo:', e);
	} finally {
		loading = false;
	}
}

/** Recarrega o catálogo forçadamente */
export async function reloadCatalog(): Promise<void> {
	loaded = false;
	await loadCatalog();
}

export function getAgents(): Agent[] { return agents; }
export function getCatalogDivisions(): Division[] { return divisions; }
export function isCatalogLoading(): boolean { return loading; }
export function isCatalogLoaded(): boolean { return loaded; }

// ---------- Filtros ----------

export function getFilters(): AgentFilters { return filters; }

export function setSearchFilter(search: string): void {
	filters = { ...filters, search };
}

export function setDivisionFilter(division: string | null): void {
	filters = { ...filters, division };
}

export function setCategoryFilter(category: string | null): void {
	filters = { ...filters, category };
}

export function clearFilters(): void {
	filters = { search: '', division: null, category: null, installStatus: 'all' };
}

/** Retorna agentes filtrados */
export function getFilteredAgents(): Agent[] {
	let result = agents;
	const f = filters;

	if (f.division) {
		result = result.filter(a => a.division === f.division);
	}
	if (f.category) {
		result = result.filter(a => a.category === f.category);
	}
	if (f.search) {
		const q = f.search.toLowerCase();
		result = result.filter(a =>
			a.title.toLowerCase().includes(q) ||
			a.slug.toLowerCase().includes(q) ||
			a.division.toLowerCase().includes(q) ||
			(a.description && a.description.toLowerCase().includes(q))
		);
	}

	return result;
}

/** Carrega detalhes completos de um agente */
export async function loadAgentDetail(slug: string): Promise<Agent | null> {
	return getAgent(slug);
}
