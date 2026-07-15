<!--
  AgWebfull — Agents Workspace Component
  Lista de agentes com busca, filtros, seleção e painel de detalhes
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { Search, Filter, X, Copy, ChevronRight, ExternalLink } from 'lucide-svelte';
	import { getFilteredAgents, getFilters, setSearchFilter, setDivisionFilter, clearFilters, getCatalogDivisions, loadAgentDetail } from '$lib/stores/catalog.svelte';
	import { selectAgent, getSelectedAgent } from '$lib/stores/ui.svelte';
	import { isAgentInstalled } from '$lib/stores/install.svelte';
	import { loadAgentContent, getCachedAgent, isLoadingAgent } from '$lib/stores/corpus.svelte';
	import { copyToClipboard } from '$lib/api';
	import { toast } from '$lib/stores/toast.svelte';
	import { marked } from 'marked';
	import type { Agent } from '$lib/types';

	let showFilters = $state(false);

	async function handleSelect(agent: Agent) {
		selectAgent(agent.slug);
		await loadAgentContent(agent.slug);
	}

	async function handleCopy() {
		const slug = getSelectedAgent();
		if (!slug) return;
		const agent = getCachedAgent(slug);
		if (!agent?.content) return;
		const ok = await copyToClipboard(agent.content);
		if (ok) toast.success('Conteúdo copiado para a área de transferência!');
		else toast.error('Falha ao copiar');
	}

	function renderMarkdown(content: string): string {
		try { return marked(content) as string; }
		catch { return content; }
	}

	function getDivisionColor(divId: string): string {
		const div = getCatalogDivisions().find(d => d.id === divId);
		return div?.color ?? 'var(--color-text-muted)';
	}
</script>

<div class="workspace">
	<!-- Painel de Lista -->
	<div class="agents-list-panel">
		<!-- Barra de Busca -->
		<div class="search-bar">
			<Search size={14} color="var(--color-text-muted)" />
			<input
				type="text"
				placeholder="Search agents..."
				value={getFilters().search}
				oninput={(e) => setSearchFilter(e.currentTarget.value)}
				aria-label="Buscar agentes"
			/>
			{#if getFilters().search}
				<button class="clear-btn" onclick={() => setSearchFilter('')} aria-label="Limpar busca">
					<X size={14} />
				</button>
			{/if}
			<button class="filter-toggle" class:active={showFilters} onclick={() => showFilters = !showFilters} aria-label="Filtros">
				<Filter size={14} />
			</button>
		</div>

		<!-- Filtros de Divisão -->
		{#if showFilters}
			<div class="filters-panel">
				<button
					class="filter-chip"
					class:active={!getFilters().division}
					onclick={() => setDivisionFilter(null)}
				>All</button>
				{#each getCatalogDivisions() as div}
					<button
						class="filter-chip"
						class:active={getFilters().division === div.id}
						onclick={() => setDivisionFilter(div.id)}
					>
						<span class="chip-dot" style="background: {div.color};"></span>
						{div.label}
						{#if div.count}<span class="chip-count">{div.count}</span>{/if}
					</button>
				{/each}
				{#if getFilters().division}
					<button class="filter-clear" onclick={clearFilters}>Clear</button>
				{/if}
			</div>
		{/if}

		<!-- Lista de Agentes -->
		<div class="agents-list" role="listbox" aria-label="Lista de agentes">
			{#each getFilteredAgents() as agent (agent.slug)}
				<button
					class="agent-item"
					class:selected={getSelectedAgent() === agent.slug}
					class:installed={isAgentInstalled(agent.slug)}
					onclick={() => handleSelect(agent)}
					role="option"
					aria-selected={getSelectedAgent() === agent.slug}
				>
					<div class="agent-color-bar" style="background: {getDivisionColor(agent.division)};"></div>
					<div class="agent-info">
						<span class="agent-title">{agent.title}</span>
						<span class="agent-division">{agent.category}</span>
					</div>
					{#if isAgentInstalled(agent.slug)}
						<span class="installed-badge">✓</span>
					{/if}
					<ChevronRight size={14} color="var(--color-text-muted)" />
				</button>
			{:else}
				<div class="empty-list">
					<p>Nenhum agente encontrado</p>
					{#if getFilters().search || getFilters().division}
						<button class="clear-filters-btn" onclick={clearFilters}>Limpar filtros</button>
					{/if}
				</div>
			{/each}
		</div>

		<div class="list-footer">
			<span class="agent-count">{getFilteredAgents().length} agentes</span>
		</div>
	</div>

	<!-- Painel de Detalhes -->
	<div class="detail-panel" class:visible={!!getSelectedAgent()}>
		{#if getSelectedAgent()}
			{@const agent = getCachedAgent(getSelectedAgent()!)}
			{#if isLoadingAgent()}
				<div class="detail-loading">
					<div class="spinner"></div>
					<p>Carregando agente...</p>
				</div>
			{:else if agent}
				<div class="detail-content">
					<div class="detail-header">
						<div class="detail-title-row">
							<span class="detail-color-dot" style="background: {getDivisionColor(agent.division)};"></span>
							<h2>{agent.title}</h2>
						</div>
						<span class="detail-division">{agent.category} · {agent.division}</span>
						{#if agent.description}
							<p class="detail-description">{agent.description}</p>
						{/if}
						<div class="detail-actions">
							<button class="action-btn primary" onclick={handleCopy}>
								<Copy size={14} />
								Copiar para Clipboard
							</button>
						</div>
					</div>

					{#if agent.content}
						<div class="detail-body prose">
							{@html renderMarkdown(agent.content)}
						</div>
					{/if}
				</div>
			{/if}
		{:else}
			<div class="detail-empty">
				<div class="empty-icon">📋</div>
				<h3>Selecione um agente</h3>
				<p>Escolha um agente da lista para ver seus detalhes e conteúdo</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.workspace {
		display: flex;
		flex: 1;
		overflow: hidden;
		height: 100%;
	}

	/* ---- Lista de Agentes ---- */
	.agents-list-panel {
		width: 320px;
		min-width: 280px;
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--color-border);
		background: var(--color-bg);
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}

	.search-bar input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		font-size: var(--text-sm);
		color: var(--color-text);
	}

	.search-bar input::placeholder { color: var(--color-text-muted); }

	.clear-btn, .filter-toggle {
		color: var(--color-text-muted);
		padding: var(--space-1);
		border-radius: var(--radius-sm);
	}

	.clear-btn:hover, .filter-toggle:hover { background: var(--color-bg-hover); }
	.filter-toggle.active { color: var(--color-accent); }

	.filters-panel {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		border-bottom: 1px solid var(--color-border);
		background: var(--color-bg-elevated);
	}

	.filter-chip {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: 2px 8px;
		border-radius: var(--radius-full);
		font-size: 10px;
		font-weight: 500;
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
		transition: all var(--transition-fast);
	}

	.filter-chip:hover { border-color: var(--color-border-strong); }
	.filter-chip.active { background: var(--color-accent-muted); border-color: var(--color-accent); color: var(--color-accent); }

	.chip-dot { width: 6px; height: 6px; border-radius: 50%; }
	.chip-count { color: var(--color-text-muted); margin-left: 2px; }

	.filter-clear {
		font-size: 10px;
		color: var(--color-text-muted);
		text-decoration: underline;
		padding: 2px 6px;
	}

	.agents-list {
		flex: 1;
		overflow-y: auto;
	}

	.agent-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
		padding: var(--space-3) var(--space-3);
		text-align: left;
		transition: background var(--transition-fast);
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.agent-item:hover { background: var(--color-bg-hover); }
	.agent-item.selected { background: var(--color-bg-selected); }

	.agent-color-bar {
		width: 3px;
		height: 28px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.agent-info {
		flex: 1;
		min-width: 0;
	}

	.agent-title {
		display: block;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.agent-division {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.installed-badge {
		font-size: 10px;
		color: var(--color-success);
		background: var(--color-success-muted);
		padding: 1px 5px;
		border-radius: var(--radius-full);
		font-weight: 600;
	}

	.list-footer {
		padding: var(--space-2) var(--space-3);
		border-top: 1px solid var(--color-border);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.empty-list {
		padding: var(--space-8);
		text-align: center;
		color: var(--color-text-muted);
		font-size: var(--text-sm);
	}

	.clear-filters-btn {
		margin-top: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-accent);
	}

	/* ---- Painel de Detalhes ---- */
	.detail-panel {
		flex: 1;
		overflow-y: auto;
		background: var(--color-bg-elevated);
	}

	.detail-loading, .detail-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: var(--space-3);
		color: var(--color-text-muted);
		text-align: center;
		padding: var(--space-8);
	}

	.empty-icon { font-size: 3rem; opacity: 0.3; }
	.detail-empty h3 { font-size: var(--text-lg); color: var(--color-text-secondary); }
	.detail-empty p { font-size: var(--text-sm); }

	.spinner {
		width: 24px;
		height: 24px;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-accent);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin { to { transform: rotate(360deg); } }

	.detail-content { padding: var(--space-6); }

	.detail-header {
		margin-bottom: var(--space-6);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.detail-title-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-1);
	}

	.detail-color-dot {
		width: 10px;
		height: 10px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.detail-header h2 {
		font-size: var(--text-xl);
		font-weight: 700;
	}

	.detail-division {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.detail-description {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.detail-actions {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-4);
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: 500;
		transition: all var(--transition-fast);
	}

	.action-btn.primary {
		background: var(--color-accent);
		color: white;
	}

	.action-btn.primary:hover {
		background: var(--color-accent-hover);
		box-shadow: var(--shadow-glow);
	}

	/* Prose para markdown renderizado */
	.detail-body.prose {
		font-size: var(--text-sm);
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	.detail-body.prose :global(h1) { font-size: var(--text-xl); margin: var(--space-6) 0 var(--space-3); color: var(--color-text); }
	.detail-body.prose :global(h2) { font-size: var(--text-lg); margin: var(--space-5) 0 var(--space-2); color: var(--color-text); }
	.detail-body.prose :global(h3) { font-size: var(--text-md); margin: var(--space-4) 0 var(--space-2); color: var(--color-text); }
	.detail-body.prose :global(p) { margin-bottom: var(--space-3); }
	.detail-body.prose :global(ul), .detail-body.prose :global(ol) { margin-bottom: var(--space-3); padding-left: var(--space-5); }
	.detail-body.prose :global(li) { margin-bottom: var(--space-1); list-style: disc; }
	.detail-body.prose :global(ol li) { list-style: decimal; }
	.detail-body.prose :global(strong) { color: var(--color-text); font-weight: 600; }
	.detail-body.prose :global(em) { font-style: italic; }
	.detail-body.prose :global(hr) { border: none; border-top: 1px solid var(--color-border); margin: var(--space-6) 0; }
	.detail-body.prose :global(a) { color: var(--color-accent); text-decoration: underline; }

	@media (max-width: 768px) {
		.workspace { flex-direction: column; }
		.agents-list-panel { width: 100%; min-width: unset; max-height: 40vh; border-right: none; border-bottom: 1px solid var(--color-border); }
		.detail-panel { min-height: 60vh; }
	}
</style>
