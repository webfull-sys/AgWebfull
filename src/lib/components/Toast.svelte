<!--
  AgWebfull — Toast Component
  Notificações flutuantes com animação
  @author Webfull (https://webfull.com.br)
-->
<script lang="ts">
	import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';
	import { getToasts, removeToast } from '$lib/stores/toast.svelte';

	const icons = { success: CheckCircle, error: AlertCircle, warning: AlertTriangle, info: Info };
</script>

{#if getToasts().length > 0}
	<div class="toast-container" role="status" aria-live="polite">
		{#each getToasts() as toast (toast.id)}
			<div class="toast toast-{toast.type}" role="alert">
				<svelte:component this={icons[toast.type]} size={16} />
				<span class="toast-message">{toast.message}</span>
				<button class="toast-close" onclick={() => removeToast(toast.id)} aria-label="Fechar notificação">
					<X size={14} />
				</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	.toast-container {
		position: fixed;
		bottom: var(--space-4);
		right: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		z-index: 9999;
		max-width: 400px;
	}

	.toast {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-lg);
		background: var(--color-bg-elevated);
		border: 1px solid var(--color-border);
		box-shadow: var(--shadow-lg);
		animation: slideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
		font-size: var(--text-sm);
	}

	.toast-success { border-left: 3px solid var(--color-success); color: var(--color-success); }
	.toast-error { border-left: 3px solid var(--color-danger); color: var(--color-danger); }
	.toast-warning { border-left: 3px solid var(--color-warning); color: var(--color-warning); }
	.toast-info { border-left: 3px solid var(--color-info); color: var(--color-info); }

	.toast-message { flex: 1; color: var(--color-text); }

	.toast-close {
		color: var(--color-text-muted);
		padding: var(--space-1);
		border-radius: var(--radius-sm);
	}
	.toast-close:hover { background: var(--color-bg-hover); }

	@keyframes slideIn {
		from { opacity: 0; transform: translateX(20px); }
		to { opacity: 1; transform: translateX(0); }
	}
</style>
