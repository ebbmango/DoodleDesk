<script lang="ts">
	import { onMount } from 'svelte';
	import { DEFAULT_FONT_SIZE, MIN_FONT_SIZE } from '$lib/constants/fonts';
	import { calculateOptimalFontSize, checkWrappedText } from '$lib/utils/layout';
	import {
		estimateTextWidth,
		updateCharStates,
		getDisplayStates,
		type CharState
	} from '$lib/utils/text';
	import AnimatedText from './AnimatedText.svelte';
	import UsernameForm from './UsernameForm.svelte';

	import {
		faCarSide,
		faCat,
		faFaceGrin,
		faStrawberry,
		faUser
	} from '@fortawesome/pro-solid-svg-icons';
	import CategoryButton from './CategoryButton.svelte';

	// Username state
	let username = '';
	let prevUsername = '';

	// Font size and layout state
	let fontSize = DEFAULT_FONT_SIZE;
	let viewportWidth = 0;
	let isWrapped = false;

	// Characters with animation status
	let charStates: CharState[] = [];
	let displayStates: CharState[] = [];

	// DOM references for layout detection
	let welcomeRef: HTMLElement;
	let nameRef: HTMLElement;

	// Layout check timing
	let layoutCheckTimer: ReturnType<typeof setTimeout> | null = null;

	// Update character states when username changes
	$: {
		if (username !== prevUsername) {
			charStates = updateCharStates(username, prevUsername, charStates);
			prevUsername = username;

			// Update display states
			displayStates = getDisplayStates(username, charStates);

			// Update font size immediately
			fontSize = calculateOptimalFontSize(
				username,
				viewportWidth,
				DEFAULT_FONT_SIZE,
				MIN_FONT_SIZE,
				estimateTextWidth
			);
		}
	}

	// Update font size when viewport width changes
	$: if (viewportWidth > 0) {
		fontSize = calculateOptimalFontSize(
			username,
			viewportWidth,
			DEFAULT_FONT_SIZE,
			MIN_FONT_SIZE,
			estimateTextWidth
		);
	}

	// Update display states when character states change
	$: displayStates = getDisplayStates(username, charStates);

	// Check for layout wrapping
	function updateWrapped() {
		const newWrapped = checkWrappedText(welcomeRef, nameRef);

		// Only update and recalculate if the wrapped state changes
		if (newWrapped !== isWrapped) {
			isWrapped = newWrapped;

			// If text is wrapped, reduce font size a bit more for readability
			if (isWrapped) {
				fontSize = fontSize * 0.9;
			}
		}
	}

	// Get viewport dimensions
	function updateViewportSize() {
		viewportWidth = window.innerWidth;
	}

	// Scheduled layout check
	function scheduleLayoutCheck() {
		if (layoutCheckTimer) clearTimeout(layoutCheckTimer);

		layoutCheckTimer = setTimeout(() => {
			updateWrapped();

			// Additional check to catch any delayed layout changes
			setTimeout(updateWrapped, 100);
			layoutCheckTimer = null;
		}, 50);
	}

	// Animation tracking callbacks
	function handleAnimationStart() {
		// Cancel any pending layout checks when new animations start
		if (layoutCheckTimer) {
			clearTimeout(layoutCheckTimer);
			layoutCheckTimer = null;
		}
	}

	function handleAnimationComplete() {
		// Schedule layout check when animations complete
		scheduleLayoutCheck();
	}

	// Handle form submission
	function handleFormSubmit() {
		// Additional logic for form submission can go here
		console.log(`Welcome, ${username}!`);
	}

	// Initialize on mount
	onMount(() => {
		// Get initial viewport size
		updateViewportSize();

		// Initial check after a small delay
		setTimeout(updateWrapped, 100);

		// Handle window resize
		const handleResize = () => {
			updateViewportSize();
			updateWrapped();
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	// Force layout check when username changes length
	$: {
		// Using username.length to trigger this reactive block
		if (username.length !== prevUsername.length) {
			scheduleLayoutCheck();
		}
	}

	// ICONS:

	let selectedCategory: string | null = null;

	function toggle(cat: string) {
		selectedCategory =
			selectedCategory === cat
				? null // deselect
				: cat; // select new
	}

	const categories = [
		{ icon: faFaceGrin, label: 'emoji' },
		{ icon: faCat, label: 'animals' },
		{ icon: faCarSide, label: 'objects' },
		{ icon: faUser, label: 'users' },
		{ icon: faStrawberry, label: 'food' }
	];
</script>

<div class="relative flex h-screen w-screen flex-col items-center justify-center gap-8">
	<div class="flex flex-wrap justify-center gap-x-6">
		<span bind:this={welcomeRef} class="font-jua text-saffron text-8xl"> Welcome, </span>

		<AnimatedText
			{displayStates}
			{fontSize}
			{isWrapped}
			bind:nameRef
			textColor={username.length > 0 ? 'text-autumn' : 'text-saffron'}
			onAnimationStart={handleAnimationStart}
			onAnimationComplete={handleAnimationComplete}
		/>
	</div>

	<div class="grid grid-cols-5">
		<!-- CATEGORY MENU -->
		<div class="flex h-[16rem] w-36 flex-col justify-center gap-2">
			{#each categories as { icon, label }}
				<CategoryButton {icon} {label} bind:selectedCategory />
			{/each}
		</div>
		<!-- ICON PICKER -->
		<div class="col-span-3 flex items-center justify-center">
			<div class="bg-saffron h-30 w-30 rounded-full"></div>
		</div>
		<!-- EMPTY (tr)  -->
		<div class=""></div>
		<!-- EMPTY (bl)-->
		<div class=""></div>
		<!-- USERNAME FIELD -->
		<div class="col-span-3">
			<UsernameForm bind:username onSubmit={handleFormSubmit} />
		</div>
		<!-- EMPTY (br) -->
		<div class=""></div>
	</div>
</div>
