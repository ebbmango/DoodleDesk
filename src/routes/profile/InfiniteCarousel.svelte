<script lang="ts">
	import gsap from 'gsap';
	import { mount, onMount } from 'svelte';

	const { elements } = $props<{ elements: number }>();
	const radius = 226 / 2;
	const center = { x: radius, y: radius };
	const sensitivity = 0.0009;

	let angleOffset = $state(0);

	let ball: Element | null;

	type LastCrossing = {
		elementIndex: number;
		direction: boolean; // true = left / false = right
	};

	let lastCrossed: LastCrossing = {
		elementIndex: 0,
		direction: true
	};

	onMount(() => {
		ball = document.querySelector('.ball-4');
		updateBallPositions();
	});

	const numbers = Array(48).map((_, i) => i);

	function determineOpacity(sin: number) {
		// It should disappear completely a third of the way halfway through 2 -> 1 || 10 -> 11
		const lowerBound = Math.sin((4 / 36) * Math.PI * 2 + Math.PI / 2); // = 0.7071067811865476
		// It should reappear completelyby 2 || 10 (moving upwards)
		const upperBound = Math.sin((2 / 12) * Math.PI * 2 + Math.PI / 2); // = 0.5

		const relativeValueOf = (sin: number) => {
			return (lowerBound - sin) / Math.abs(upperBound - lowerBound);
		};

		const cappedRelativeValueOf = (sin: number) => {
			return Math.min(Math.max(relativeValueOf(sin), 0), 1);
		};

		return cappedRelativeValueOf(sin);
	}

	function updateBallPositions(mousewheelDelta?: number) {
		for (let i = 0; i < elements; i++) {
			/*
            2 × PI = Complete Circle; Thus (2 × PI) ÷ N = N slices.
            Since JS starts from (sin = 1, cos = 0) and progresses DOWNWARDS,
            + Math.PI / 2 moves all elements a quarter of a circle forwards,
            thus placing "0" on the starting position.
            */
			const angle = angleOffset + (i / elements) * Math.PI * 2 + Math.PI / 2;
			const cos = Math.cos(angle);
			const sin = Math.sin(angle);
			const x = center.x + radius * cos;
			const y = center.y + radius * sin;
			gsap.set(`.ball-${i}`, {
				x,
				y,
				opacity: determineOpacity(sin),
				scale: determineOpacity(sin)
			});

			if (mousewheelDelta === undefined) continue;

			const direction = mousewheelDelta > 0;

			// true = left / false = right
			if (
				// if an element has crossed the threshold
				Math.abs(sin - 1) < 0.001 &&
				cos < 0.001 &&
				(lastCrossed.elementIndex !== i || lastCrossed.direction !== direction)
			) {
				lastCrossed.elementIndex = i;
				lastCrossed.direction = direction;
				console.log(`${i} ${direction ? 'clockwise' : 'counterclockwise'}`);

				// and now here is where I try to inject the correct numbers on the balls
				const ball = document.querySelector(`.ball-${i}`);
				const base = 12;
				// console.log(ball);
				if (ball) {
					const currentNumber = Number(ball.innerHTML);
					let newNumber: number;

					if (direction) {
						newNumber = currentNumber - base;
						if (newNumber < 0) newNumber = numbers.length + newNumber;
					} else {
						const max = numbers.length - 1;
						newNumber = currentNumber + base;
						if (newNumber > max) newNumber %= base;
					}
					// if the ball is going to the left

					// elements shown
					// let newNumber: number;

					// if (direction) {

					// } else {

					// }

					ball.innerHTML = '' + newNumber;
				}
			}
		}
	}

	function handleWheel(event: WheelEvent) {
		const cappedDeltaY = Math.max(-50, Math.min(50, event.deltaY));
		angleOffset += cappedDeltaY * sensitivity;
		updateBallPositions(event.deltaY);
	}
</script>

<div class="relative h-[262px] w-[262px] bg-gray-100" onwheel={handleWheel}>
	{#each Array(elements) as _, i}
		<div
			class="bg-saffron absolute flex h-9 w-9 items-center justify-center rounded-full text-white ball-{i}"
		>
			{i}
		</div>
	{/each}
</div>
