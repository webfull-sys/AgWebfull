/**
 * AgWebfull — Store de Projects (Svelte 5 runes)
 * @author Webfull (https://webfull.com.br)
 */
import type { Project } from '$lib/types';
import { getProjects } from '$lib/api';

let projects = $state<Project[]>([]);
let loaded = $state(false);

export async function loadProjects(): Promise<void> {
	projects = await getProjects();
	loaded = true;
}

export function getAllProjects(): Project[] { return projects; }
export function isProjectsLoaded(): boolean { return loaded; }
export function getProjectById(id: string): Project | undefined { return projects.find(p => p.id === id); }
