<!--
  AgWebfull — Projects Component
  Projetos detectados (stub web)
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { FolderKanban, AlertTriangle } from 'lucide-svelte';
	import { getAllProjects } from '$lib/stores/projects.svelte';
</script>

<div class="projects-view">
	<header class="projects-header">
		<h1><FolderKanban size={20} /> Projects</h1>
		<p class="subtitle">Projetos com agentes instalados</p>
	</header>

	{#if getAllProjects().length > 0}
		<div class="projects-grid">
			{#each getAllProjects() as project (project.id)}
				<div class="project-card">
					<h3>{project.name}</h3>
					<code class="project-path">{project.path}</code>
					<span class="project-agents">{project.agents.length} agentes</span>
				</div>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<FolderKanban size={48} strokeWidth={1} color="var(--color-text-muted)" />
			<h3>Nenhum projeto detectado</h3>
			<p>A detecção de projetos requer o aplicativo desktop para escanear diretórios locais.</p>
			<div class="web-notice">
				<AlertTriangle size={14} color="var(--color-warning)" />
				<span>Na versão web, projetos não podem ser detectados automaticamente. Use o app desktop para essa funcionalidade.</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.projects-view { flex: 1; overflow-y: auto; padding: var(--space-6); }
	.projects-header { margin-bottom: var(--space-6); }
	.projects-header h1 { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-2xl); font-weight: 700; }
	.subtitle { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-1); }
	.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4); }
	.project-card { background: var(--color-bg-elevated); border: 1px solid var(--color-border); border-radius: var(--radius-xl); padding: var(--space-5); }
	.project-card h3 { font-size: var(--text-md); font-weight: 600; margin-bottom: var(--space-2); }
	.project-path { font-size: var(--text-xs); color: var(--color-text-muted); display: block; margin-bottom: var(--space-2); }
	.project-agents { font-size: var(--text-xs); color: var(--color-text-secondary); }
	.empty-state { text-align: center; padding: var(--space-16); color: var(--color-text-muted); }
	.empty-state h3 { font-size: var(--text-lg); color: var(--color-text-secondary); margin-top: var(--space-4); }
	.empty-state p { font-size: var(--text-sm); margin-top: var(--space-2); max-width: 400px; margin-inline: auto; }
	.web-notice { display: inline-flex; align-items: center; gap: var(--space-2); margin-top: var(--space-4); padding: var(--space-3) var(--space-4); background: var(--color-warning-muted); border-radius: var(--radius-md); font-size: var(--text-xs); }
</style>
