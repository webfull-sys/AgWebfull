<!--
  AgWebfull — Settings Component
  Configurações do app com seções de tema, catálogo e informações
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { Settings as SettingsIcon, Sun, Moon, Monitor, Info, ExternalLink, Heart, Github } from 'lucide-svelte';
	import { getCurrentSettings, updateSettings } from '$lib/stores/settings.svelte';
	import { getAppVersion, openExternal } from '$lib/api';
	import type { AppSettings } from '$lib/types';

	const themes: { value: AppSettings['theme']; label: string; icon: typeof Sun }[] = [
		{ value: 'dark', label: 'Dark', icon: Moon },
		{ value: 'light', label: 'Light', icon: Sun },
		{ value: 'system', label: 'System', icon: Monitor },
	];
</script>

<div class="settings-view">
	<header class="settings-header">
		<h1><SettingsIcon size={20} /> Settings</h1>
	</header>

	<!-- Tema -->
	<section class="settings-section">
		<h2>Aparência</h2>
		<div class="setting-row">
			<div class="setting-info">
				<span class="setting-label">Tema</span>
				<span class="setting-desc">Escolha entre modo escuro, claro ou do sistema</span>
			</div>
			<div class="theme-switcher">
				{#each themes as theme}
					<button
						class="theme-btn"
						class:active={getCurrentSettings().theme === theme.value}
						onclick={() => updateSettings({ theme: theme.value })}
					>
						<svelte:component this={theme.icon} size={14} />
						{theme.label}
					</button>
				{/each}
			</div>
		</div>
	</section>

	<!-- Catálogo -->
	<section class="settings-section">
		<h2>Catálogo</h2>
		<div class="setting-row">
			<div class="setting-info">
				<span class="setting-label">Fonte do catálogo</span>
				<span class="setting-desc">Agentes carregados do catálogo embutido</span>
			</div>
			<span class="setting-value">Bundled (local)</span>
		</div>
		<div class="setting-row">
			<div class="setting-info">
				<span class="setting-label">URL do catálogo</span>
				<span class="setting-desc">Repositório original de personas</span>
			</div>
			<button class="link-btn" onclick={() => openExternal(getCurrentSettings().catalogUrl)}>
				agency-agents <ExternalLink size={12} />
			</button>
		</div>
	</section>

	<!-- Sobre -->
	<section class="settings-section">
		<h2>Sobre</h2>
		<div class="about-card">
			<div class="about-logo">🧠</div>
			<div class="about-info">
				<h3>AgWebfull</h3>
				<p>Versão {getAppVersion()} · Web Edition</p>
				<p class="about-credit">
					Baseado no <button class="inline-link" onclick={() => openExternal('https://github.com/msitarzewski/agency-agents-app')}>agency-agents-app</button> (MIT) por Michael Sitarzewski
				</p>
				<p class="about-credit">
					Desenvolvido por <button class="inline-link" onclick={() => openExternal('https://webfull.com.br')}>Webfull</button>
				</p>
			</div>
		</div>
	</section>
</div>

<style>
	.settings-view { flex: 1; overflow-y: auto; padding: var(--space-6); max-width: 700px; }
	.settings-header { margin-bottom: var(--space-6); }
	.settings-header h1 { display: flex; align-items: center; gap: var(--space-2); font-size: var(--text-2xl); font-weight: 700; }

	.settings-section {
		margin-bottom: var(--space-8);
		padding-bottom: var(--space-6);
		border-bottom: 1px solid var(--color-border);
	}

	.settings-section h2 {
		font-size: var(--text-md);
		font-weight: 600;
		color: var(--color-text);
		margin-bottom: var(--space-4);
	}

	.setting-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) 0;
		gap: var(--space-4);
	}

	.setting-info { flex: 1; }
	.setting-label { display: block; font-size: var(--text-sm); font-weight: 500; color: var(--color-text); }
	.setting-desc { display: block; font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
	.setting-value { font-size: var(--text-sm); color: var(--color-text-secondary); }

	.theme-switcher {
		display: flex;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.theme-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-text-secondary);
		border-right: 1px solid var(--color-border);
		transition: all var(--transition-fast);
	}

	.theme-btn:last-child { border-right: none; }
	.theme-btn:hover { background: var(--color-bg-hover); }
	.theme-btn.active { background: var(--color-accent-muted); color: var(--color-accent); }

	.link-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-accent);
	}

	.link-btn:hover { text-decoration: underline; }

	.about-card {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		padding: var(--space-5);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
	}

	.about-logo { font-size: 2.5rem; }

	.about-info h3 { font-size: var(--text-lg); font-weight: 700; }
	.about-info p { font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: var(--space-1); }
	.about-credit { font-size: var(--text-xs) !important; color: var(--color-text-muted) !important; margin-top: var(--space-2) !important; }

	.inline-link {
		color: var(--color-accent);
		text-decoration: underline;
		font-size: inherit;
	}
</style>
