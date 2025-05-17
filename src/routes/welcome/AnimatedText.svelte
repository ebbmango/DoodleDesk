<script lang="ts">
	import { createCharacterAnimation } from '$lib/utils/animations';
	import type { CharState } from '$lib/utils/text';
	import { text } from '@sveltejs/kit';

	export let displayStates: CharState[] = [];
	export let fontSize: number;
	export let isWrapped: boolean = false;
	export let textColor: string;
	export let exclamationColor: string = 'text-saffron';
	export let onAnimationStart: () => void;
	export let onAnimationComplete: () => void;

	// Reference to the name container for layout detection
	export let nameRef: HTMLElement;

	// Keep track of active animations
	let activeAnimations = 0;

	// Animation handler for characters
	function animateChar(node: HTMLElement, isNew: boolean) {
		if (isNew) {
			// Track animation start
			activeAnimations++;
			onAnimationStart();
		}

		return createCharacterAnimation(node, isNew, () => {
			if (isNew) {
				// Decrement count when animation completes
				activeAnimations--;

				// Call callback when all animations are done
				if (activeAnimations === 0) {
					onAnimationComplete();
				}
			}
		});
	}
</script>

<span
	bind:this={nameRef}
	style={`font-size: ${fontSize}px; line-height: 96px`}
	class={`font-jua flex min-w-72 flex-wrap ${textColor} ${isWrapped ? 'justify-center' : 'justify-start'}`}
>
	{#each displayStates as state (state.id)}
		<span class="char inline-block" use:animateChar={state.isNew}>
			{state.char}
		</span>
	{/each}
	<span class={exclamationColor}>!</span>
</span>
