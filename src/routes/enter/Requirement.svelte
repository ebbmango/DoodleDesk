<script lang="ts">
	import { faCheckSquare, faXmarkSquare } from '@fortawesome/pro-solid-svg-icons';
	import Fa from 'svelte-fa';
	export let text: string;
	export let valid = false;
</script>

<div
	role="status"
	aria-live="polite"
	class={`flex items-center gap-2 ${valid ? 'text-saffron' : 'text-festival'}`}
>
	<Fa icon={valid ? faCheckSquare : faXmarkSquare} />
	<p>{text}</p>
</div>
