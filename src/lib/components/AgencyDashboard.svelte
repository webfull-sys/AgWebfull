<!--
  AgWebfull — Agency Dashboard Component
  Painel principal com métricas, saúde e cobertura por divisão
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { BarChart3, Users, Wrench, CheckCircle, AlertTriangle, TrendingUp, Globe } from 'lucide-svelte';
	import { getAgents, getCatalogDivisions } from '$lib/stores/catalog.svelte';
	import { getRecords } from '$lib/stores/install.svelte';
	import { getTools } from '$lib/api';
	import { onMount } from 'svelte';
	import type { Tool } from '$lib/types';

	let tools = $state<Tool[]>([]);

	onMount(async () => {
		tools = await getTools();
	});

	function getStats() {
		const agents = getAgents();
		const records = getRecords();
		const divisions = getCatalogDivisions();
		return {
			totalAgents: agents.length,
			installedAgents: new Set(records.map(r => r.agentSlug)).size,
			totalTools: tools.length,
			totalDivisions: divisions.length,
			totalInstalls: records.length,
		};
	}

	function getDivisionStats() {
		const agents = getAgents();
		const records = getRecords();
		const divisions = getCatalogDivisions();
		return divisions.map(d => {
			const divAgents = agents.filter(a => a.division === d.id);
			const installed = divAgents.filter(a => records.some(r => r.agentSlug === a.slug)).length;
			return { ...d, total: divAgents.length, installed, pct: divAgents.length > 0 ? Math.round((installed / divAgents.length) * 100) : 0 };
		}).sort((a, b) => b.total - a.total);
	}
</script>

<div class="dashboard">
	<header class="dashboard-header">
		<div class="header-title">
			<h1>Dashboard</h1>
			<span class="header-subtitle">Visão geral do catálogo e instalações</span>
		</div>
	</header>

	<!-- Stat Cards -->
	<div class="stat-grid">
		<div class="stat-card">
			<div class="stat-icon" style="background: var(--color-accent-muted);">
				<Users size={20} color="var(--color-accent)" />
			</div>
			<div class="stat-info">
				<span class="stat-value">{getStats().totalAgents}</span>
				<span class="stat-label">Agentes no Catálogo</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon" style="background: var(--color-success-muted);">
				<CheckCircle size={20} color="var(--color-success)" />
			</div>
			<div class="stat-info">
				<span class="stat-value">{getStats().installedAgents}</span>
				<span class="stat-label">Agentes Instalados</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon" style="background: var(--color-info-muted);">
				<Wrench size={20} color="var(--color-info)" />
			</div>
			<div class="stat-info">
				<span class="stat-value">{getStats().totalTools}</span>
				<span class="stat-label">Ferramentas Suportadas</span>
			</div>
		</div>

		<div class="stat-card">
			<div class="stat-icon" style="background: var(--color-warning-muted);">
				<BarChart3 size={20} color="var(--color-warning)" />
			</div>
			<div class="stat-info">
				<span class="stat-value">{getStats().totalInstalls}</span>
				<span class="stat-label">Total de Instalações</span>
			</div>
		</div>
	</div>

	<!-- Coverage by Division -->
	<section class="dashboard-section">
		<h2 class="section-title">
			<Globe size={18} />
			Catálogo por Divisão
		</h2>
		<div class="division-grid">
			{#each getDivisionStats() as div}
				<div class="division-card">
					<div class="division-header">
						<span class="division-dot" style="background: {div.color};"></span>
						<span class="division-name">{div.label}</span>
						<span class="division-count">{div.total}</span>
					</div>
					<div class="division-bar-track">
						<div
							class="division-bar-fill"
							style="width: {div.pct}%; background: {div.color};"
						></div>
					</div>
					<span class="division-pct">{div.installed}/{div.total} instalados</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Tools Overview -->
	<section class="dashboard-section">
		<h2 class="section-title">
			<Wrench size={18} />
			Ferramentas Suportadas
		</h2>
		<div class="tools-grid">
			{#each [...tools].sort((a, b) => a.order - b.order) as tool}
				<div class="tool-chip">
					<span class="tool-dot" style="background: {tool.accent};"></span>
					<span class="tool-name">{tool.label}</span>
					<span class="tool-kind">{tool.installKind}</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- Web Notice -->
	<section class="dashboard-section web-notice">
		<div class="notice-card">
			<AlertTriangle size={18} color="var(--color-warning)" />
			<div>
				<strong>Versão Web</strong>
				<p>Alguns recursos como instalação direta no filesystem, detecção de ferramentas e Git clone requerem o aplicativo desktop. Na versão web, use a opção "Copiar para Clipboard".</p>
			</div>
		</div>
	</section>
</div>

<style>
	.dashboard {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-6);
		max-width: 1200px;
	}

	.dashboard-header {
		margin-bottom: var(--space-6);
	}

	.header-title h1 {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text);
	}

	.header-subtitle {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: var(--space-4);
		margin-bottom: var(--space-8);
	}

	.stat-card {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-5);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		transition: all var(--transition-base);
	}

	.stat-card:hover {
		border-color: var(--color-border-strong);
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}

	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: var(--radius-lg);
		flex-shrink: 0;
	}

	.stat-value {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-text);
		line-height: 1;
	}

	.stat-label {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.dashboard-section {
		margin-bottom: var(--space-8);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-md);
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: var(--space-4);
	}

	.division-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: var(--space-3);
	}

	.division-card {
		padding: var(--space-3) var(--space-4);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: border-color var(--transition-fast);
	}

	.division-card:hover {
		border-color: var(--color-border-strong);
	}

	.division-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.division-dot {
		width: 8px;
		height: 8px;
		border-radius: var(--radius-full);
		flex-shrink: 0;
	}

	.division-name {
		flex: 1;
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	.division-count {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
		font-weight: 600;
	}

	.division-bar-track {
		height: 4px;
		background: var(--color-bg-surface);
		border-radius: var(--radius-full);
		overflow: hidden;
		margin-bottom: var(--space-1);
	}

	.division-bar-fill {
		height: 100%;
		border-radius: var(--radius-full);
		transition: width var(--transition-slow);
		min-width: 2px;
	}

	.division-pct {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.tools-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.tool-chip {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
	}

	.tool-dot {
		width: 6px;
		height: 6px;
		border-radius: var(--radius-full);
	}

	.tool-name {
		font-weight: 500;
		color: var(--color-text);
	}

	.tool-kind {
		color: var(--color-text-muted);
		font-size: 10px;
	}

	.notice-card {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-warning-muted);
		border: 1px solid color-mix(in srgb, var(--color-warning) 30%, transparent);
		border-radius: var(--radius-lg);
		font-size: var(--text-sm);
	}

	.notice-card strong {
		display: block;
		margin-bottom: var(--space-1);
		color: var(--color-text);
	}

	.notice-card p {
		color: var(--color-text-secondary);
		line-height: 1.5;
	}

	@media (max-width: 768px) {
		.dashboard { padding: var(--space-4); }
		.stat-grid { grid-template-columns: 1fr 1fr; }
		.division-grid { grid-template-columns: 1fr; }
	}

	@media (max-width: 480px) {
		.stat-grid { grid-template-columns: 1fr; }
	}
</style>
