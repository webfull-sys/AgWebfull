/**
 * AgWebfull — Store de Corpus (Svelte 5 runes)
 * Gerencia carregamento de conteúdo completo dos agentes
 * @author Webfull (https://webfull.com.br)
 */
import type { Agent } from '$lib/types';
import { getAgent } from '$lib/api';

let agentCache = $state<Map<string, Agent>>(new Map());
let loadingSlug = $state<string | null>(null);

export async function loadAgentContent(slug: string): Promise<Agent | null> {
	if (agentCache.has(slug)) return agentCache.get(slug)!;
	loadingSlug = slug;
	try {
		const agent = await getAgent(slug);
		if (agent) {
			const newCache = new Map(agentCache);
			newCache.set(slug, agent);
			agentCache = newCache;
		}
		return agent;
	} finally {
		loadingSlug = null;
	}
}

export function getCachedAgent(slug: string): Agent | undefined { return agentCache.get(slug); }
export function isLoadingAgent(): boolean { return loadingSlug !== null; }
export function getLoadingSlug(): string | null { return loadingSlug; }
