/**
 * AgWebfull — Store de Atividade (Svelte 5 runes)
 * @author Webfull (https://webfull.com.br)
 */
import type { ActivityItem } from '$lib/types';
import { getActivityHistory } from '$lib/api';

let items = $state<ActivityItem[]>([]);
let loaded = $state(false);

export async function loadActivity(): Promise<void> {
	items = await getActivityHistory();
	loaded = true;
}

export function getActivities(): ActivityItem[] { return items; }
export function isActivityLoaded(): boolean { return loaded; }
