<!--
  AgWebfull — Página Principal (SPA)
  Renderiza o componente ativo baseado na aba selecionada
  Baseado no agency-agents-app (MIT) por Michael Sitarzewski
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import AgencyDashboard from '$lib/components/AgencyDashboard.svelte';
	import AgentsWorkspace from '$lib/components/AgentsWorkspace.svelte';
	import ToolsView from '$lib/components/ToolsView.svelte';
	import Teams from '$lib/components/Teams.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import Settings from '$lib/components/Settings.svelte';
	import { getActiveTab } from '$lib/stores/ui.svelte';
</script>

<div class="page-content">
	{#if getActiveTab() === 'dashboard'}
		<AgencyDashboard />
	{:else if getActiveTab() === 'agents'}
		<AgentsWorkspace />
	{:else if getActiveTab() === 'tools'}
		<ToolsView />
	{:else if getActiveTab() === 'teams'}
		<Teams />
	{:else if getActiveTab() === 'projects'}
		<Projects />
	{:else if getActiveTab() === 'settings'}
		<Settings />
	{/if}
</div>

<style>
	.page-content {
		flex: 1;
		display: flex;
		overflow: hidden;
	}
</style>
