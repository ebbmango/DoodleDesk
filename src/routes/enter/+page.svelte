<!-- todo: validate email format -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';
	import { SplitText } from 'gsap/SplitText';

	import Warning from '$lib/components/AuthWarning.svelte';
	import PasswordRequirement from '$lib/components/PasswordRequirement.svelte';

	import { AUTH_ERRORS } from '$lib/constants/authErrors';
	const { title, messages } = AUTH_ERRORS.INVALID_PASSWORD;
	const segments = messages[1];

	// UI state
	let showPassword = false;
	let isSignUpMode = false;
	let hasInteracted = false;
	let initialized = false;
	let showWarn = true;
	let actuallyRenderWarn = true;

	// DOM refs
	let cardRef: HTMLDivElement;
	let warningRef: HTMLDivElement;
	let loginText: HTMLParagraphElement;
	let signupText: HTMLParagraphElement;
	let emailInput: HTMLInputElement;

	// Password state
	let password = '';
	let confirm = '';

	// GSAP split text instances
	let login: SplitText;
	let signup: SplitText;

	// Animation constants
	const CARD_WIDTH_LOGIN = 400;
	const CARD_WIDTH_SIGNUP = 640;
	const SIGNUP_TEXT_INITIAL_OFFSET = 62;
	const SIGNUP_TEXT_TARGET_Y = -38;
	const LOGIN_TEXT_EXIT_Y = -50;
	const SIGNUP_TEXT_RETURN_Y = 12;
	const WARNING_CARD_TARGET_X = -360;

	function dismiss() {
		showWarn = false;
		setTimeout(() => {
			actuallyRenderWarn = false;
		}, 600); // match your fade-out animation duration
	}

	// Password validation rules
	$: isLongEnough = password.length >= 8;
	$: hasUpper = /[A-Z]/.test(password);
	$: hasLower = /[a-z]/.test(password);
	$: hasNumber = /\d/.test(password);
	$: hasSpecial = /[^A-Za-z0-9]/.test(password);
	$: matches = password === confirm;

	$: isValid =
		!isSignUpMode ||
		(password.length >= 8 &&
			/[A-Z]/.test(password) &&
			/[a-z]/.test(password) &&
			/\d/.test(password) &&
			/[^A-Za-z0-9]/.test(password) &&
			password === confirm);

	function setMode() {
		isSignUpMode = !isSignUpMode;
		hasInteracted ||= true;

		if (isSignUpMode) {
			showWarn = true;
			actuallyRenderWarn = true;
		}
	}

	let canToggleMode = true;

	let modeToggleWrapper: HTMLElement;

	function throttledSetMode() {
		if (!canToggleMode) return;
		canToggleMode = false;

		// Animate out current text + button
		gsap.to(modeToggleWrapper, {
			autoAlpha: 0,
			duration: 0.2,
			onComplete: () => {
				setMode();
				// Animate in new state
				gsap.to(modeToggleWrapper, { autoAlpha: 1, duration: 0.4 });
			}
		});

		setTimeout(() => {
			canToggleMode = true;
		}, 600);
	}

	function animateWords(target: gsap.TweenTarget, y: number, duration = 0.5) {
		gsap.to(target, {
			y,
			duration,
			stagger: 0.03,
			ease: 'power2.out'
		});
	}

	function clickPulse(node: HTMLElement) {
		node.addEventListener('click', () => {
			gsap.fromTo(
				node,
				{ scale: 1 },
				{ scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }
			);
		});
	}

	// Watch for animation triggers
	$: if (browser && initialized && hasInteracted) {
		console.log(showWarn);
		gsap.to(cardRef, {
			width: isSignUpMode ? CARD_WIDTH_SIGNUP : CARD_WIDTH_LOGIN,
			duration: 0.6
		});

		gsap.to(warningRef, {
			x: showWarn ? WARNING_CARD_TARGET_X : 0,
			duration: 0.6,
			ease: showWarn ? 'back.out(1.0)' : 'back.in(1.0)'
		});

		if (isSignUpMode) {
			animateWords(login.words, LOGIN_TEXT_EXIT_Y, 0.4);
			animateWords(signup.words, SIGNUP_TEXT_TARGET_Y, 0.6);
		} else {
			animateWords(signup.words, SIGNUP_TEXT_RETURN_Y, 0.4);
			animateWords(login.words, 0, 0.6);
		}
	}

	onMount(() => {
		if (!browser) return;

		gsap.registerPlugin(SplitText);
		login = SplitText.create(loginText, { type: 'words' });
		signup = SplitText.create(signupText, { type: 'words' });
		gsap.set(signup.words, { y: SIGNUP_TEXT_INITIAL_OFFSET });

		initialized = true;
	});

	function handleSubmit(event: SubmitEvent) {
		console.log(emailInput.validity);

		// if signup:
		if (isSignUpMode) {
			emailInput.validity;
		} else {
		}
		// 1. INVALID_EMAIL_FORMAT
		// 2. EMAIL_EXISTS
		// if login:
		// 1. EMAIL_NOT_FOUND
		// 2. INVALID_PASSWORD
		// finally:
		// 1. CONNECTION_FAILED (?)
		// 2. SERVER_ERROR
		// 3. TIMEOUT
		// 4. DEFAULT
	}
</script>

<div class="relative flex h-screen w-screen items-center justify-center">
	<!-- notifications panel -->

	<!-- notification -->

	<!-- login panel -->
	<div class="mb-10">
		<div class="mb-3 flex cursor-default flex-col gap-2 text-center">
			<p class="font-jua text-festival opacity text-2xl">Welcome to</p>
			<h1 class="font-jua text-saffron text-6xl">DoodleDesk</h1>
		</div>

		{#if actuallyRenderWarn}
			<div bind:this={warningRef}>
				<Warning {title} {segments} {dismiss} {setMode} {isSignUpMode} />
			</div>
		{/if}

		<!-- Shadow (confirm password panel) -->
		<div
			bind:this={cardRef}
			class="bg-autumn absolute z-0 flex h-100 w-100 translate-x-6 translate-y-6 transform flex-col items-end justify-center rounded-3xl pe-6"
		>
			<div class="flex -translate-y-3 flex-col gap-5">
				<div class="ms-2.5 flex flex-col items-start gap-2.5">
					<PasswordRequirement valid={isLongEnough} text="At least 8 characters" />
					<PasswordRequirement valid={hasUpper} text="One uppercase letter" />
					<PasswordRequirement valid={hasLower} text="One lowercase letter" />
					<PasswordRequirement valid={hasNumber} text="One number" />
					<PasswordRequirement valid={hasSpecial} text="One special character" />
					<PasswordRequirement valid={matches} text="Passwords must match" />
				</div>
				<div class="flex flex-col items-center gap-0.5">
					<input
						bind:value={confirm}
						type={showPassword ? 'text' : 'password'}
						name="repeat-password"
						placeholder={showPassword ? 'password' : '•••••••••'}
						id="repeat-password"
						class="bg-sunblush text-saffron placeholder:text-autumn w-55 rounded-xl border-0 focus:ring-0"
					/>
					<label for="repeat-password" class="text-festival me-2.5">confirm your password</label>
				</div>
			</div>
		</div>
		<!-- Main card -->
		<main
			class="bg-sunblush relative z-10 flex h-100 w-100 flex-col items-center justify-between gap-3 rounded-3xl pt-6"
		>
			<!-- Header -->
			<div
				class="bg-whitesmoke text-festival relative flex h-10 w-90 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl text-xl"
			>
				<p bind:this={loginText} class="absolute"><strong>Log in</strong> to your account</p>
				<p bind:this={signupText} class="absolute -bottom-8">
					<strong>Sign up</strong> for an account
				</p>
			</div>

			<div class="flex justify-end">
				<img src="/stroke-whitesmoke.png" alt="Decoration" class="h-auto w-70" />
				<svg
					class="fill-festival h-16 w-16 -translate-x-1.5 translate-y-0.5"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					><path
						d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1 0 32c0 8.8 7.2 16 16 16l32 0zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
					/></svg
				>
			</div>

			<form novalidate on:submit={handleSubmit} class="flex flex-col gap-4">
				<!-- email field -->
				<div class="flex flex-col gap-0.5">
					<label for="email" class="text-festival ms-2.5">email</label>
					<input
						required
						id="email"
						name="email"
						type="email"
						bind:this={emailInput}
						placeholder="your@email.com"
						class="bg-whitesmoke text-saffron rounded-xl border-0 placeholder:text-gray-400 focus:ring-0"
					/>
				</div>
				<!-- password field -->
				<div class="relative flex flex-col items-end gap-0.5">
					<input
						required
						id="password"
						name="password"
						type={showPassword ? 'text' : 'password'}
						bind:value={password}
						placeholder={showPassword ? 'password' : '•••••••••'}
						class="bg-whitesmoke text-saffron rounded-xl border-0 placeholder:text-gray-400 focus:ring-0"
					/>
					<label for="password" class="text-festival me-2.5">password</label>
					<!-- toggle visibility -->
					<button
						type="button"
						on:click={() => (showPassword = !showPassword)}
						class="text-festival absolute top-2.5 -right-7"
						aria-label="Toggle password visibility"
					>
						<svg
							class={`${showPassword ? 'scale-105 hover:scale-120' : 'scale-100 hover:scale-115'} fill-festival hover:fill-saffron h-5 w-5 duration-100`}
							xmlns="http://www.w3.org/2000/svg"
							viewBox={showPassword ? '0 0 640 512' : '0 0 576 512'}
							><path
								d={showPassword
									? // eye icon
										'M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zM223.1 149.5C248.6 126.2 282.7 112 320 112c79.5 0 144 64.5 144 144c0 24.9-6.3 48.3-17.4 68.7L408 294.5c8.4-19.3 10.6-41.4 4.8-63.3c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3c0 10.2-2.4 19.8-6.6 28.3l-90.3-70.8zM373 389.9c-16.4 6.5-34.3 10.1-53 10.1c-79.5 0-144-64.5-144-144c0-6.9 .5-13.6 1.4-20.2L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5L373 389.9z'
									: // eye-off icon
										'M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'}
							/></svg
						>
					</button>
				</div>
				<!-- enter -->
				<button
					disabled={!isValid}
					type="submit"
					use:clickPulse
					class="bg-festival text-whitesmoke border-festival hover:border-saffron hover:bg-saffron disabled:bg-sunblush disabled:border-autumn disabled:text-autumn w-30 -translate-y-7 rounded-lg border-2 py-1 transition-colors duration-200 disabled:border-2"
					>Enter</button
				>
			</form>
		</main>
		<!-- Change form text -->
		<div
			class="mt-10 flex translate-x-3 items-center justify-center gap-2"
			bind:this={modeToggleWrapper}
		>
			<p class="text-festival">
				{isSignUpMode ? 'Already have an account?' : 'Do not have an account yet?'}
			</p>
			<button
				type="button"
				use:clickPulse
				on:click={throttledSetMode}
				class="text-whitesmoke bg-sunblush hover:bg-autumn rounded-md px-4 py-1"
			>
				{isSignUpMode ? 'Log In' : 'Join'}
			</button>
		</div>
	</div>
	<div class="absolute bottom-3 mt-4">
		<a
			href="#"
			class="text-autumn hover:text-saffron inline-block cursor-pointer text-sm duration-150 hover:-translate-y-0.5 hover:scale-110"
		>
			Forgot your password?
		</a>
	</div>
</div>
