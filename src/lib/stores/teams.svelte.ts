/**
 * AgWebfull — Store de Teams (Svelte 5 runes)
 * @author Webfull (https://webfull.com.br)
 */
import type { Team } from '$lib/types';
import { getTeams, saveTeam as apiSave, deleteTeam as apiDelete } from '$lib/api';

let teams = $state<Team[]>([]);
let loaded = $state(false);

export async function loadTeams(): Promise<void> {
	teams = await getTeams();
	loaded = true;
}

export async function saveTeam(team: Team): Promise<void> {
	await apiSave(team);
	await loadTeams();
}

export async function removeTeam(id: string): Promise<void> {
	await apiDelete(id);
	await loadTeams();
}

export function getAllTeams(): Team[] { return teams; }
export function isTeamsLoaded(): boolean { return loaded; }
export function getTeamById(id: string): Team | undefined { return teams.find(t => t.id === id); }
