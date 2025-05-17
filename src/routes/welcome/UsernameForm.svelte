<!-- src/lib/components/WelcomeScreen/UsernameForm.svelte -->
<script lang="ts">
	import { ALLOWED_CHARS_REGEX } from '$lib/utils/text';

	export let username: string = '';
	export let onSubmit: () => void;

	// Input reference
	let usernameInput: HTMLInputElement;

	// Handle form submission
	function handleSubmit(e: Event) {
		e.preventDefault();
		onSubmit();
	}

	// Handle input validation
	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement | null;
		if (!target) return;
		target.value = target.value.replace(ALLOWED_CHARS_REGEX, '');
		username = target.value;
	}

	// Handle paste validation
	function handlePaste(e: ClipboardEvent) {
		const pasted = e.clipboardData?.getData('text') ?? '';
		if (ALLOWED_CHARS_REGEX.test(pasted)) {
			e.preventDefault();
		}
	}
</script>

<form
	name="username"
	class="bg-sunblush flex w-105 flex-col items-center gap-4 rounded-3xl pt-8 pb-6"
	on:submit={handleSubmit}
>
	<h3 class="text-saffron mb-3 text-3xl font-semibold">How should we call you?</h3>
	<input
		required
		id="username"
		name="username"
		bind:this={usernameInput}
		bind:value={username}
		type="text"
		maxlength="16"
		placeholder="username"
		class="bg-whitesmoke text-festival w-70 rounded-xl border-0 text-center font-light placeholder:text-gray-400 focus:ring-0"
		on:input={handleInput}
		on:paste={handlePaste}
	/>
	<button type="submit" class="bg-festival text-whitesmoke rounded-lg px-5 py-1.5">
		Let's go!
	</button>
</form>
