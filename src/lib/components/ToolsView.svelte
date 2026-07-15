<!--
  AgWebfull — ToolsView Component
  Lista de ferramentas suportadas com detalhes e accent colors
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { Wrench, ExternalLink, AlertTriangle, Check } from 'lucide-svelte';
	import { getTools } from '$lib/api';
	import { getToolInstalls } from '$lib/stores/install.svelte';
	import { onMount } from 'svelte';
	import type { Tool } from '$lib/types';

	let tools = $state<Tool[]>([]);
	let selectedTool = $state<Tool | null>(null);

	onMount(async () => {
		tools = await getTools();
	});
</script>

<div class="tools-view">
	<header class="tools-header">
		<h1><Wrench size={20} /> Tools</h1>
		<p class="subtitle">Ferramentas de código suportadas pelo catálogo de agentes</p>
	</header>

	<div class="tools-layout">
		<!-- Grid de Tools -->
		<div class="tools-grid">
			{#each [...tools].sort((a, b) => a.order - b.order) as tool (tool.id)}
				{@const installs = getToolInstalls(tool.kebab)}
				<button
					class="tool-card"
					class:selected={selectedTool?.id === tool.id}
					onclick={() => selectedTool = tool}
				>
					<div class="tool-accent" style="background: {tool.accent};"></div>
					<div class="tool-body">
						<h3 class="tool-label">{tool.label}</h3>
						<div class="tool-meta">
							<span class="tool-format">{tool.format}</span>
							<span class="tool-kind">{tool.installKind}</span>
						</div>
						<div class="tool-scopes">
							{#if tool.scope.user}<span class="scope-badge">User</span>{/if}
							{#if tool.scope.project}<span class="scope-badge">Project</span>{/if}
						</div>
						{#if installs.length > 0}
							<div class="tool-installs">
								<Check size={12} color="var(--color-success)" />
								<span>{installs.length} agente{installs.length > 1 ? 's' : ''}</span>
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>

		<!-- Detalhe da Tool Selecionada -->
		{#if selectedTool}
			<div class="tool-detail">
				<div class="detail-accent" style="background: {selectedTool.accent};"></div>
				<h2>{selectedTool.label}</h2>
				<table class="detail-table">
					<tbody>
						<tr><th>ID</th><td>{selectedTool.id}</td></tr>
						<tr><th>Format</th><td><code>{selectedTool.format}</code></td></tr>
						<tr><th>Install Kind</th><td>{selectedTool.installKind}</td></tr>
						<tr><th>Scopes</th><td>{[selectedTool.scope.user && 'User', selectedTool.scope.project && 'Project'].filter(Boolean).join(', ')}</td></tr>
						<tr><th>Order</th><td>{selectedTool.order}</td></tr>
					</tbody>
				</table>

				<div class="detail-notice">
					<AlertTriangle size={14} color="var(--color-warning)" />
					<span>Na versão web, a detecção automática e instalação direta no filesystem não estão disponíveis. Use "Copiar para Clipboard" nos agentes.</span>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.tools-view {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-6);
	}

	.tools-header {
		margin-bottom: var(--space-6);
	}

	.tools-header h1 {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-2xl);
		font-weight: 700;
	}

	.subtitle {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-top: var(--space-1);
	}

	.tools-layout {
		display: flex;
		gap: var(--space-6);
	}

	.tools-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--space-3);
		flex: 1;
	}

	.tool-card {
		display: flex;
		text-align: left;
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all var(--transition-base);
	}

	.tool-card:hover {
		border-color: var(--color-border-strong);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.tool-card.selected {
		border-color: var(--color-accent);
		box-shadow: var(--shadow-glow);
	}

	.tool-accent {
		width: 4px;
		flex-shrink: 0;
	}

	.tool-body {
		padding: var(--space-4);
		flex: 1;
	}

	.tool-label {
		font-size: var(--text-md);
		font-weight: 600;
		margin-bottom: var(--space-2);
	}

	.tool-meta {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.tool-format, .tool-kind {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		padding: 1px 6px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.tool-scopes {
		display: flex;
		gap: var(--space-1);
	}

	.scope-badge {
		font-size: 10px;
		padding: 1px 6px;
		border-radius: var(--radius-full);
		background: var(--color-bg-surface);
		color: var(--color-text-secondary);
	}

	.tool-installs {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		margin-top: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-success);
	}

	.tool-detail {
		width: 320px;
		min-width: 280px;
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-5);
		align-self: flex-start;
		position: sticky;
		top: var(--space-6);
	}

	.detail-accent {
		width: 100%;
		height: 4px;
		border-radius: var(--radius-full);
		margin-bottom: var(--space-4);
	}

	.tool-detail h2 {
		font-size: var(--text-lg);
		font-weight: 700;
		margin-bottom: var(--space-4);
	}

	.detail-table {
		width: 100%;
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	.detail-table th {
		text-align: left;
		padding: var(--space-1) var(--space-2) var(--space-1) 0;
		color: var(--color-text-muted);
		font-weight: 500;
		white-space: nowrap;
	}

	.detail-table td {
		padding: var(--space-1) 0;
		color: var(--color-text);
	}

	.detail-notice {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		padding: var(--space-3);
		background: var(--color-warning-muted);
		border-radius: var(--radius-md);
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.tools-layout { flex-direction: column; }
		.tool-detail { width: 100%; min-width: unset; position: static; }
	}
</style>
