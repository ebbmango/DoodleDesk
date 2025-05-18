<script lang="ts">
	import type { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
	import gsap from 'gsap';
	import Fa from 'svelte-fa';

	export let icon: IconDefinition;
	export let label: string;

	// two-way bound into parent
	export let selectedCategory: string | null;

	// computed
	$: isSelected = selectedCategory === label;

	function handleClick() {
		// toggle on/off
		selectedCategory = isSelected ? null : label;
	}

	function clickPulse(node: HTMLElement) {
		node.addEventListener('click', () => {
			gsap.fromTo(
				node,
				{ x: 0 },
				{
					x: -8, // move 8px to the right
					duration: 0.1,
					yoyo: true,
					repeat: 1,
					ease: 'power1.out'
				}
			);
		});
	}
</script>

<button
	use:clickPulse
	on:click={handleClick}
	class={`${isSelected ? 'bg-festival text-whitesmoke ms-2' : 'bg-sunblush text-festival hover:text-saffron hover:ms-2'} font-jua flex h-10 w-35 origin-left items-center rounded-2xl px-2 ps-2.5 duration-200 hover:w-44`}
>
	<div class="flex w-7 justify-center">
		<Fa {icon} class="text-2xl" />
	</div>
	<p class="w-full">{label}</p>
</button>
