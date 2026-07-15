<!--
  AgWebfull — Root Layout
  Shell principal com sidebar + content area + toast
  Baseado no agency-agents-app (MIT) por Michael Sitarzewski
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import '$lib/styles/reset.css';
	import '$lib/styles/tokens.css';
	import '$lib/styles/typography.css';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { loadCatalog } from '$lib/stores/catalog.svelte';
	import { loadSettings } from '$lib/stores/settings.svelte';
	import { loadInstalls } from '$lib/stores/install.svelte';
	import { loadTeams } from '$lib/stores/teams.svelte';
	import { loadProjects } from '$lib/stores/projects.svelte';
	import { loadActivity } from '$lib/stores/activity.svelte';

	let { children }: { children: Snippet } = $props();
	let ready = $state(false);

	onMount(async () => {
		// Carregar todos os dados em paralelo
		await Promise.all([
			loadSettings(),
			loadCatalog(),
			loadInstalls(),
			loadTeams(),
			loadProjects(),
			loadActivity(),
		]);
		ready = true;
	});
</script>

<svelte:head>
	<title>AgWebfull — Agentes IA para Ferramentas de Código</title>
	<meta name="description" content="Navegue, explore e gerencie 251+ personas de agentes IA especializados para Claude Code, Cursor, Codex, Gemini CLI e mais." />
</svelte:head>

{#if ready}
	<div class="app-shell" role="application">
		<Sidebar />
		<main class="app-content">
			{@render children()}
		</main>
		<Toast />
	</div>
{:else}
	<div class="loading-screen" role="status" aria-label="Carregando aplicação">
		<div class="loading-content">
			<div class="loading-logo">🧠</div>
			<h1 class="loading-title">AgWebfull</h1>
			<div class="loading-bar">
				<div class="loading-bar-fill"></div>
			</div>
			<p class="loading-text">Carregando catálogo de agentes...</p>
		</div>
	</div>
{/if}

<style>
	.app-shell {
		display: flex;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		background: var(--color-bg);
	}

	.app-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	/* Loading Screen */
	.loading-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		width: 100vw;
		background: var(--color-bg);
	}

	.loading-content {
		text-align: center;
	}

	.loading-logo {
		font-size: 4rem;
		margin-bottom: var(--space-4);
		animation: pulse 2s ease-in-out infinite;
	}

	.loading-title {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: var(--space-6);
		letter-spacing: -0.02em;
	}

	.loading-bar {
		width: 200px;
		height: 3px;
		background: var(--color-border);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin: 0 auto var(--space-4);
	}

	.loading-bar-fill {
		height: 100%;
		width: 40%;
		background: var(--color-accent);
		border-radius: var(--radius-full);
		animation: loadingSlide 1.2s ease-in-out infinite;
	}

	.loading-text {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}

	@keyframes loadingSlide {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(350%); }
	}

	/* Responsividade Mobile */
	@media (max-width: 768px) {
		.app-shell {
			flex-direction: row;
		}

		.app-content {
			margin-left: 0;
		}
	}
</style>
