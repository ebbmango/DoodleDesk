export type MsgSegment =
	| { type: "text"; content: string; bold?: boolean }
	| { type: "action"; content: string; action: "login" | "signup" }
	| { type: "link"; href: string; label: string }
	| { type: "email"; content: string }
	| { type: "linebreak" };

export interface AuthErrorDef {
	title: string;
	messages: MsgSegment[][];
}

export const AUTH_ERRORS: Record<string, AuthErrorDef> = {
	EMPTY_EMAIL_SIGNUP: {
		title: "Email required",
		messages: [
			[
				// We need your <strong>email</strong> to say hi!
				{ type: "text", content: "We need your " },
				{ type: "text", content: "email", bold: true },
				{ type: "text", content: " to say hi!" },
			],
			[
				// "We can't say hi without an <strong>email</strong>. Mind dropping yours in?"
				{ type: "text", content: "We can't say hi without an " },
				{ type: "text", content: "email", bold: true },
				{ type: "text", content: ". Mind dropping yours in?" },
			],
			[
				// "We've got a welcome note ready — just need an email to send it flying."
				{
					type: "text",
					content:
						"We've got a welcome note ready! All we need is your ",
				},
				{ type: "text", content: "email", bold: true },
				{ type: "text", content: " to send it flying!" },
			],
			[
				// "We'll need your email to get things started. It won't be shared — pinky promise.",
				{ type: "text", content: "We'll need your " },
				{ type: "text", content: "email", bold: true },
				{
					type: "text",
					content:
						" to get things started. It won't be shared. Pinky promise!",
				},
			],
		],
	},
	EMAIL_EXISTS: {
		title: "Email already in use",
		messages: [
			[
				// Looks like you're already part of the crew. Try logging in instead.
				{ type: "text", content: "Looks like you're already part of the crew. Try " },
				{ type: "action", content: "logging in", action: "login" },
				{ type: "text", content: " instead." },
			],
			[
				// "Hey, we know this one! Log in to pick up where you left off."
				{ type: "text", content: "Hey, we know this one! " },
				{ type: "action", content: "Log in", action: "login" },
				{ type: "text", content: " to pick up where you left off." },
			],
			[
				// This email is already registered. Maybe try logging in instead?
				{ type: "text", content: "This email is already registered. Maybe try " },
				{ type: "action", content: "logging in", action: "login" },
				{ type: "text", content: " instead?" },
			],
		],
	},
	INVALID_EMAIL_FORMAT: {
		title: "Invalid email address",
		messages: [
			[
				// "Hmm... that doesn't look right. Try something like you@example.com instead."
				{ type: "text", content: "Hmm... that doesn't look right. Try something like " },
				{ type: "email", content: "you@example.com" },
				{ type: "text", content: " instead." },
			],
			[
				// "We're looking for something like name@domain.com — but cooler. You get the idea!"
				{ type: "text", content: "We're looking for something like " },
				{ type: "email", content: "name@domain.com" },
				{ type: "text", content: " — but cooler. You get the idea!" },
			],
			[
				// "The gate's sealed by magic. Only a valid email like open@sesame.com can unlock it!"
				{ type: "text", content: "The gate is sealed by magic. " },
				{ type: "linebreak" },
				{ type: "text", content: "Only a " },
				{ type: "text", content: "valid email", bold: true },
				{ type: "text", content: " can unlock it. Try a format such as: "},
				{ type: "email", content: "open@sesame.com" },
				{ type: "text", content: "." },
			],
		],
	},
	EMPTY_EMAIL_LOGIN: {
		title: "Email required",
		messages: [
			[
				// ID, please! We need your email to verify you're on the guest list.
				{ type: "text", content: "\"Your ID, please!\"" },
				{ type: "linebreak" },
				{ type: "text", content: "We need your " },
				{ type: "text", content: "email", bold: true },
				{ type: "text", content: " to verify you're on the guest list." },
			],
			[
				// "You’re almost there! Just drop your email to continue.",
				{ type: "text", content: "You're almost there! Just drop your " },
				{ type: "text", content: "email", bold: true },
				{ type: "text", content: " to continue." },
			],
			[
				// "We need your digital coordinates (aka your email) to open this portal!",
				{ type: "text", content: "We're reaching across dimensions — but we need your ",},
				{ type: "text", content: "email", bold: true },
				{ type: "text", content: " to lock in!" },
			],
		],
	},
	UNRECOGNIZED_EMAIL: {
		title: "Unrecognized email",
		messages: [
			[
				// "We couldn’t find an account with that email. Check for typos, or sign up instead!",
				{ type: "text", content: "We couldn't find an account with that email. Check for typos, or ", },
				{ type: "action", content: "sign up", action: "signup" },
				{ type: "text", content: " instead!" },
			],
			[
				// "We searched the archives… but found no trace of that email. Try another or sign up anew!"
				{ type: "text", content: "We searched the archives… but found no trace of that email." },
				{ type: "linebreak" },
				{ type: "text", content: "Try another or " },
				{ type: "action", content: "sign up", action: "signup" },
				{ type: "text", content: " to begin your journey!" },
			],
			[
				// "Can't find this email on the guest list. Check your spelling or sign up to join the party!",
				{ type: "text", content: "This email is not on the guest list. Check your spelling or " },
				{ type: "action", content: "sign up", action: "signup" },
				{ type: "text", content: " to join the party!" },
			],
		],
	},
	INVALID_PASSWORD: {
		title: "Incorrect password",
		messages: [
			[
				// "You knocked, but the magic word was off. Try again or reset your password.",
				{ type: "text", content: "You knocked, but the passphrase was off. Check your spelling or " },
				{ type: "link", label: "reset your password", href: "#" },
				{ type: "text", content: "." },
			],
			[
				// "Give it another shot! Or try resetting your password."
				{ type: "text", content: "Give it another shot!" },
				{ type: "linebreak" },
				{ type: "text", content: "Or try " },
				{ type: "link", label: "resetting your password", href: "#" },
				{ type: "text", content: "." },
			],
			[
				// "Oops, wrong key to the kingdom! Try again or summon a password reset spell."
				{ type: "text", content: "Oops, wrong key to the kingdom! Try again or summon a ", },
				{ type: "link", label: "password reset", href: "#" },
				{ type: "text", content: " spell." },
			],
			[
				// "That password didn't work. Check your caps lock or try resetting it.",
				{ type: "text", content: "That password didn't work. Check your caps lock or " },
				{ type: "link", label: "try resetting it", href: "#" },
				{ type: "text", content: "." },
			],
			[
				// "Your credentials were rejected by the Council of Access. Please try again or reset your password."
				{ type: "text", content:"Your credentials were rejected by the Council of Access. Please try again or " },
				{ type: "link", label: "reset your password", href: "#" },
				{ type: "text", content: "." },
			],
		],
	},
	EMPTY_PASSWORD: {
		title: "Password missing",
		messages: [
			[
				// "Every club has a secret handshake. Between us, it's your <strong>password</strong>. Just don't show it to anyone!"
				{ type: "text", content: "To enter this club you need a secret handshake." },
				{ type: "linebreak" },
				{ type: "text", content: "(spoiler: it's your " },
				{ type: "text", content: "password", bold: true },
				{ type: "text", content: ")" },
			],
			[
				// "Just one more step — pop in your password and you're good to go!"
				{ type: "text", content: "Just one more step — pop in your " },
				{ type: "text", content: "password", bold: true },
				{ type: "text", content: " and you're in!" },
			],
			[
				// "The ancient terminal glows faintly… awaiting a password."
				{ type: "text", content: "The ancient terminal glows faintly… awaiting a " },
				{ type: "text", content: "password", bold: true },
				{ type: "text", content: "." },
			],
			[
				// "Speak, friend, and enter... Or simply enter your password — that works too!"
				{ type: "text", content: "Speak, friend, and enter...", },
				{ type: "linebreak" },
				{ type: "text", content: "Or simply ", },
				{ type: "text", content: "enter your password", bold: true },
				{ type: "text", content: " — that works too!" },
			],
		],
	},
	CONNECTION_FAILED: {
		title: "No internet",
		messages: [
			[
				// "Looks like you're offline. Check your internet connection and try again."
				{ type: "text", content: "Looks like you're offline. " },
				{ type: "text", content: "Check your internet connection and try again.", bold: true },
			],
			[
				// "Houston, we have a problem! Your internet's gone AWOL. Check your signal and retry."
				{ type: "text", content: "Houston, we have a problem! Your internet's gone AWOL. ", },
				{ type: "text", content: "Check your signal", bold: true },
				{ type: "text", content: " and retry." },
			],
			[
				// "We're waving, but no one's waving back. Are you still online?"
				{ type: "text", content: "You're waving, but no one's waving back. ", },
				{ type: "text", content: "Are you still online?", bold: true },
			],
			[
				// "Your connection has temporarily left the chat. Check your Wi-Fi and try again."
				{ type: "text", content: "Your connection has temporarily left the chat. " },
				{ type: "text", content: "Check your Wi-Fi", bold: true },
				{ type: "text", content: " and try again." },
			],
		],
	},
	SERVER_ERROR: {
		title: "Server error",
		messages: [
			[
				// "Something broke on our side. We're working on it — please try again shortly."
				{ type: "text", content: "Something broke on our side. We're working on it! ", },
				{ type: "linebreak" },
				{ type: "text", content: "Please try again", bold: true },
				{ type: "text", content: " shortly." },
			],
			[
				// "Oops! Our servers tripped over a digital shoelace. Please try again in a moment!"
				{ type: "text", content: "Oops! " },
				{ type: "text", content: "Our servers tripped over a digital shoelace. ", },
				{ type: "linebreak" },
				{ type: "text", content: "Please try again", bold: true },
				{ type: "text", content: " in a moment!" },
			],
			[
				// "Something went poof. We're un-poofing it. Please try again in a moment!"
				{ type: "text", content: "Something went poof.", },
				{ type: "linebreak" },
				{ type: "text", content: "We're un-poofing it. ", },
				{ type: "linebreak" },
				{ type: "text", content: "Please try again", bold: true },
				{ type: "text", content: " in a moment!" },
			],
		],
	},
	TIMEOUT: {
		title: "Request timed out",
		messages: [
			[
				// "The request took too long to respond. Try again — it usually works on the second go."
				{ type: "text", content: "The request took too long to respond. ", },
				{ type: "text", content: "Try again", bold: true },
				{ type: "text", content: " — it usually works on the second go.", },
			],
			[
				// "This is taking longer than a dentist appointment. Let's try that again!"
				{ type: "text", content: "This is taking longer than a dentist appointment." }, 
				{ type: "linebreak" },
				{ type: "text", content: "Let's " }, 
				{ type: "text", content: "try that again!", bold: true },
			],
			[
				// "This is moving slower than a sloth on vacation. Let's try that again!"
				{ type: "text", content: "This is moving slower than", },
				{ type: "linebreak" },
				{ type: "text", content: "a sloth on vacation.", },
				{ type: "linebreak" },
				{ type: "text", content: "Please ", },
				{ type: "text", content: "try again!", bold: true },
			],
			[
				// "Things are taking longer than expected. Try again in a moment."
				{ type: "text", content: "Things are taking longer than expected. Please " },
				{ type: "text", content: "try again", bold: true },
				{ type: "text", content: "." },
			],
		],
	},
	DEFAULT: {
		title: "Unexpected error",
		messages: [
			[
				// "Something unexpected happened. Please refresh or try again shortly."
				{ type: "text", content: "Something unexpected happened. Please refresh the page or " },
				{ type: "text", content: "try again", bold: true },
				{ type: "text", content: " shortly." },
			],
			[
				// "Minor glitch in the matrix. Please try again — no pills required."
				{ type: "text", content: "Minor glitch in the matrix. " },
				{ type: "linebreak" },
				{ type: "text", content: "Please try again.", bold: true },
				{ type: "linebreak" },
				{ type: "text", content: "(no pills required)" },
			],
			[
				// "Reality blinked. We're stabilizing the simulation — try again in a sec."
				{ type: "text", content: "Reality blinked. We're stabilizing the simulation — " },
				{ type: "text", content: "try again", bold: true },
				{ type: "text", content: " in a sec." },
			],
			[
				// "Reality momentarily unraveled. We're stitching it back together. Please try again."
				{ type: "text", content: "Reality momentarily unraveled. We're stitching it back together. Please " },
				{ type: "text", content: "try again", bold: true },
				{ type: "text", content: "." },
			],
		],
	},
};
