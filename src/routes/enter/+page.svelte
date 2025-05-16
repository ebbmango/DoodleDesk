<!-- todo: validate email format -->

<script lang="ts">
	import { Fa } from 'svelte-fa';
	import { faEye, faEyeSlash, faPencil } from '@fortawesome/pro-solid-svg-icons';

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
				<Fa
					icon={faPencil}
					style="width: 4rem; height: 4rem;"
					class="text-festival -translate-x-1.5 translate-y-0.5"
				/>
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
						<Fa
							icon={showPassword ? faEyeSlash : faEye }
							style="width: 20px; height: 20px;"
							class={`${showPassword ? 'scale-105 hover:scale-120' : 'scale-100 hover:scale-115'} fill-festival hover:fill-saffron duration-100`}
						/>
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
