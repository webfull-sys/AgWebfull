<!--
  AgWebfull — Teams Component
  Gerenciamento de equipes de agentes
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { UsersRound, Plus, Trash2, User } from 'lucide-svelte';
	import { getAllTeams } from '$lib/stores/teams.svelte';
	import { getAgents } from '$lib/stores/catalog.svelte';
</script>

<div class="teams-view">
	<header class="teams-header">
		<h1><UsersRound size={20} /> Teams</h1>
		<p class="subtitle">Equipes de agentes especializados para seus projetos</p>
	</header>

	<div class="teams-grid">
		{#each getAllTeams() as team (team.id)}
			<div class="team-card" class:built-in={team.isBuiltIn}>
				<div class="team-header">
					<h3>{team.name}</h3>
					{#if team.isBuiltIn}
						<span class="built-in-badge">Built-in</span>
					{/if}
				</div>
				{#if team.description}
					<p class="team-description">{team.description}</p>
				{/if}
				<div class="team-agents">
					{#each team.agents as agentSlug}
						{@const agent = getAgents().find(a => a.slug === agentSlug)}
						{#if agent}
							<div class="team-agent-chip">
								<User size={12} />
								<span>{agent.title}</span>
							</div>
						{/if}
					{/each}
				</div>
				<div class="team-footer">
					<span class="agent-count">{team.agents.length} agentes</span>
				</div>
			</div>
		{:else}
			<div class="empty-state">
				<UsersRound size={48} strokeWidth={1} color="var(--color-text-muted)" />
				<h3>Nenhuma equipe</h3>
				<p>Equipes permitem agrupar agentes por projeto ou função</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.teams-view {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-6);
	}

	.teams-header { margin-bottom: var(--space-6); }

	.teams-header h1 {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-2xl);
		font-weight: 700;
	}

	.subtitle { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-1); }

	.teams-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--space-4);
	}

	.team-card {
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: var(--space-5);
		transition: all var(--transition-base);
	}

	.team-card:hover {
		border-color: var(--color-border-strong);
		box-shadow: var(--shadow-md);
	}

	.team-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-2);
	}

	.team-header h3 { font-size: var(--text-md); font-weight: 600; }

	.built-in-badge {
		font-size: 10px;
		padding: 2px 8px;
		border-radius: var(--radius-full);
		background: var(--color-accent-muted);
		color: var(--color-accent);
		font-weight: 500;
	}

	.team-description {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		margin-bottom: var(--space-3);
	}

	.team-agents {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.team-agent-chip {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: 2px 8px;
		border-radius: var(--radius-full);
		background: var(--color-bg-surface);
		font-size: var(--text-xs);
		color: var(--color-text-secondary);
	}

	.team-footer {
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: var(--space-16);
		color: var(--color-text-muted);
	}

	.empty-state h3 { font-size: var(--text-lg); color: var(--color-text-secondary); margin-top: var(--space-4); }
	.empty-state p { font-size: var(--text-sm); margin-top: var(--space-2); }
</style>
