import gsap from "gsap";

/**
 * Creates a GSAP animation for new characters
 * @param node DOM element to animate
 * @param isNew Whether this is a new character that should animate
 * @param onComplete Callback function to run when animation completes
 */
export function createCharacterAnimation(
    node: HTMLElement,
    isNew: boolean,
    onComplete: () => void,
) {
    // Only animate if this is a new character
    if (!isNew) return;

    // Create and return the GSAP animation
    const animation = gsap.from(node, {
        y: 60,
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "back.out(1.7)",
        onComplete,
    });

    return {
        destroy() {
            animation.kill();
        },
    };
}
