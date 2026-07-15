/**
 * AgWebfull — Store de Runbooks (Svelte 5 runes)
 * @author Webfull (https://webfull.com.br)
 */
import type { Runbook } from '$lib/types';

let runbooks = $state<Runbook[]>([
	{ id: 'getting-started', title: 'Getting Started with Agents', content: 'Learn how to browse, select, and use agent personas with your AI coding tools.', agents: [], tools: [] },
	{ id: 'team-setup', title: 'Setting Up a Team', content: 'Create a team of agents tailored to your project needs.', agents: [], tools: [] },
]);

export function getRunbooks(): Runbook[] { return runbooks; }
export function getRunbookById(id: string): Runbook | undefined { return runbooks.find(r => r.id === id); }
