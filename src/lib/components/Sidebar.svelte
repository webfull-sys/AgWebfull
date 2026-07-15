<!--
  AgWebfull — Sidebar Component
  Navegação principal com ícones Lucide e indicador de aba ativa
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { LayoutDashboard, Users, Wrench, UsersRound, FolderKanban, Settings, ChevronLeft, ChevronRight, Brain } from 'lucide-svelte';
	import { getActiveTab, setActiveTab, getSidebarCollapsed, toggleSidebar } from '$lib/stores/ui.svelte';
	import { t } from '$lib/stores/i18n.svelte';
	import type { MainTab } from '$lib/types';

	const navItems: { id: MainTab; icon: typeof LayoutDashboard; label: string }[] = [
		{ id: 'dashboard', icon: LayoutDashboard, label: 'nav.dashboard' },
		{ id: 'agents', icon: Users, label: 'nav.agents' },
		{ id: 'tools', icon: Wrench, label: 'nav.tools' },
		{ id: 'teams', icon: UsersRound, label: 'nav.teams' },
		{ id: 'projects', icon: FolderKanban, label: 'nav.projects' },
		{ id: 'settings', icon: Settings, label: 'nav.settings' },
	];
</script>

<aside class="sidebar" class:collapsed={getSidebarCollapsed()} role="navigation" aria-label="Navegação principal">
	<!-- Logo -->
	<div class="sidebar-logo">
		<Brain size={24} strokeWidth={1.5} color="var(--color-accent)" />
		{#if !getSidebarCollapsed()}
			<span class="logo-text">AgWebfull</span>
		{/if}
	</div>

	<!-- Nav Items -->
	<nav class="sidebar-nav">
		{#each navItems as item}
			<button
				class="nav-item"
				class:active={getActiveTab() === item.id}
				onclick={() => setActiveTab(item.id)}
				title={t(item.label)}
				aria-current={getActiveTab() === item.id ? 'page' : undefined}
			>
				<svelte:component this={item.icon} size={18} strokeWidth={1.5} />
				{#if !getSidebarCollapsed()}
					<span class="nav-label">{t(item.label)}</span>
				{/if}
			</button>
		{/each}
	</nav>

	<!-- Collapse Toggle -->
	<button class="sidebar-toggle" onclick={toggleSidebar} title={getSidebarCollapsed() ? 'Expandir' : 'Recolher'} aria-label="Alternar sidebar">
		{#if getSidebarCollapsed()}
			<ChevronRight size={16} />
		{:else}
			<ChevronLeft size={16} />
		{/if}
	</button>
</aside>

<style>
	.sidebar {
		display: flex;
		flex-direction: column;
		width: var(--sidebar-width);
		min-width: var(--sidebar-width);
		height: 100vh;
		background: var(--sidebar-bg);
		border-right: 1px solid var(--sidebar-border);
		padding: var(--space-2) 0;
		transition: width var(--transition-slow), min-width var(--transition-slow);
		overflow: hidden;
		z-index: 10;
	}

	.sidebar.collapsed {
		width: var(--sidebar-collapsed);
		min-width: var(--sidebar-collapsed);
	}

	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4) var(--space-4) var(--space-6);
		white-space: nowrap;
		overflow: hidden;
	}

	.logo-text {
		font-size: var(--text-md);
		font-weight: 700;
		color: var(--color-text);
		letter-spacing: -0.02em;
	}

	.sidebar-nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: 0 var(--space-2);
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		color: var(--sidebar-text);
		font-size: var(--text-sm);
		font-weight: 500;
		white-space: nowrap;
		transition: all var(--transition-fast);
		position: relative;
	}

	.nav-item:hover {
		background: var(--sidebar-item-hover);
		color: var(--sidebar-text-active);
	}

	.nav-item.active {
		background: var(--sidebar-item-active);
		color: var(--sidebar-text-active);
	}

	.nav-item.active::before {
		content: '';
		position: absolute;
		left: -8px;
		top: 50%;
		transform: translateY(-50%);
		width: 3px;
		height: 16px;
		background: var(--color-accent);
		border-radius: 0 var(--radius-full) var(--radius-full) 0;
	}

	.sidebar-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-3);
		margin: var(--space-2);
		border-radius: var(--radius-md);
		color: var(--color-text-muted);
		transition: all var(--transition-fast);
	}

	.sidebar-toggle:hover {
		background: var(--color-bg-hover);
		color: var(--color-text);
	}

	/* Responsividade */
	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			left: 0;
			top: 0;
			width: var(--sidebar-collapsed);
			min-width: var(--sidebar-collapsed);
		}
		.nav-label, .logo-text {
			display: none;
		}
	}
</style>
