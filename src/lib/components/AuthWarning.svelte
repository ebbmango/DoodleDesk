<script lang="ts">
	import Fa from 'svelte-fa';
	import type { MsgSegment } from '../constants/authErrors';
	import { faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons';
	let { title, segments, dismiss, setMode, isSignUpMode } = $props();
</script>

<section
	role="alert"
	aria-live="assertive"
	class="group absolute mb-11 flex translate-x-15 flex-col"
>
	<!-- Header -->
	<div
		class={`group/header bg-festival flex w-70 justify-center gap-1 rounded-4xl rounded-b-none px-4 py-2 duration-150 hover:rounded-tr-lg hover:pe-10`}
	>
		<h3 class="text-whitesmoke text-center text-xl font-medium text-nowrap">{title}</h3>
		<!-- Close button -->
		<button
			onclick={dismiss}
			aria-label="Dismiss warning"
			class="bg-saffron hover:bg-autumn absolute top-3 right-3 flex h-5 w-5 justify-center rounded-full opacity-0 duration-150 group-hover/header:opacity-100 hover:cursor-pointer"
		>
			<svg class="fill-whitesmoke w-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
				<path
					d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
				/>
			</svg>
		</button>
	</div>

	<!-- Body -->
	<div class="bg-whitesmoke border-festival flex w-70 flex-col gap-1 rounded-bl-4xl px-4 pt-3 pb-4">
		<p class="text-md text-festival text-center">
			{#each segments as seg: MsgSegment}
				{#if seg.type === 'text'}
					{#if seg.bold}
						<strong>{seg.content}</strong>
					{:else}
						{@html seg.content}
					{/if}
				{:else if seg.type === 'action'}
					<button
						type="button"
						class="hover:text-saffron cursor-pointer font-bold duration-250 hover:mx-0.5 hover:scale-105"
						onclick={() => {
							if (seg.action === (isSignUpMode ? 'login' : 'signup')) {
								setMode();
							}
							dismiss();
						}}
					>
						{seg.content}
					</button>
				{:else if seg.type === 'link'}
					<a
						href={seg.href}
						class="text-autumn hover:text-saffron inline-block italic duration-250 hover:mx-1 hover:scale-105"
						>{seg.label}</a
					>
				{:else if seg.type === 'email'}
					<code class="text-autumn font-mono">{seg.content}</code>
				{:else if seg.type === 'linebreak'}
					<br />
				{/if}
			{/each}
		</p>
	</div>

	<!-- Icon -->
	<Fa
		icon={faTriangleExclamation}
		style="width: 5rem; height: 5rem;"
		class={`text-festival absolute -bottom-6 -left-12 w-20 -rotate-10 duration-150 group-hover:scale-110`}
	/>
</section>
