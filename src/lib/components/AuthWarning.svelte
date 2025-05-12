<script lang="ts">
	let { title, message, onclick } = $props();
</script>

<section
	role="alert"
	aria-live="assertive"
	class="group absolute mb-11 flex translate-x-15 flex-col"
>
	<div
		class={`group/header bg-festival flex w-70 justify-center gap-1 rounded-4xl rounded-b-none px-4 py-2 duration-150 hover:rounded-tr-lg hover:pe-10`}
	>
		<h3 class="text-whitesmoke text-center text-xl font-medium text-nowrap">{title}</h3>
		<!-- close button -->
		<button
			{onclick}
			aria-label="Dismiss warning"
			class="bg-saffron hover:bg-autumn absolute top-3 right-3 flex h-5 w-5 justify-center rounded-full opacity-0 duration-150 group-hover/header:opacity-100 hover:cursor-pointer"
		>
			<svg class="fill-whitesmoke w-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
				><path
					d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
				/></svg
			>
		</button>
	</div>
	<div class="bg-whitesmoke border-festival flex w-70 flex-col gap-1 rounded-bl-4xl px-4 py-3">
		<p class="text-md text-festival text-center">{@html message}</p>
	</div>
	<svg
		class={`fill-festival absolute -bottom-6 -left-12 w-20 -rotate-10 duration-150 group-hover:scale-110`}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 512 512"
	>
		<path
			d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480L40 480c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24l0 112c0 13.3 10.7 24 24 24s24-10.7 24-24l0-112c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
		/>
	</svg>
</section>
