import { CHAR_WIDTHS } from "$lib/constants/fonts";

/**
 * Filter to allow only specified characters in user input
 * Allows alphanumeric and commonly used symbols
 */
export const ALLOWED_CHARS_REGEX =
    /[^A-Za-z0-9|~+><=^$.,:()/?![\]'&@"_#%\*"";{}\ ]/g;

/**
 * Interface for character state in animated text
 */
export interface CharState {
    char: string;
    isNew: boolean;
    id: string; // Unique identifier for each character position
}

/**
 * Estimates text width based on known character widths and font size
 */
export function estimateTextWidth(
    text: string,
    fontSize: number,
    defaultFontSize: number,
): number {
    // Scale the character widths based on font size
    const scaleFactor = fontSize / defaultFontSize;

    // Sum up the widths of all characters
    return text.split("").reduce((sum, char) => {
        // Use the defined width or a default value
        const charWidth = (CHAR_WIDTHS[char] || 0.9) * scaleFactor;
        return sum + charWidth;
    }, 0);
}

/**
 * Helper function to identify new characters when typing
 * Compares old and new text to determine which characters should animate
 */
export function updateCharStates(
    newText: string,
    oldText: string,
    existingStates: CharState[],
): CharState[] {
    // If either string is empty, all characters in the new string are considered new
    if (oldText === "") {
        return newText.split("").map((char, i) => ({
            char,
            isNew: true,
            id: `char-${i}`,
        }));
    }

    // Find the differing index by comparing strings character by character
    let diffIndex = -1;
    const minLength = Math.min(oldText.length, newText.length);

    for (let i = 0; i < minLength; i++) {
        if (oldText[i] !== newText[i]) {
            diffIndex = i;
            break;
        }
    }

    // If no difference was found in the common part, the diff starts at the end of the shorter string
    if (diffIndex === -1) {
        diffIndex = minLength;
    }

    // Handle the case where text is added (newText is longer)
    if (newText.length > oldText.length) {
        // Calculate how many characters were added
        const addedCount = newText.length - oldText.length;

        // Create the new char states array
        return newText.split("").map((char, i) => {
            // Characters before the diff point remain unchanged
            if (i < diffIndex) {
                // Reuse existing character state if available
                return i < existingStates.length
                    ? { ...existingStates[i], isNew: false }
                    : { char, isNew: false, id: `char-${i}` };
            } // Only the newly added characters should animate
            else if (i < diffIndex + addedCount) {
                return { char, isNew: true, id: `char-${i}-${Date.now()}` };
            } // Characters after the insertion remain unchanged
            else {
                // Index in the old text, accounting for the added characters
                const oldIndex = i - addedCount;
                // Reuse existing character state if available
                return oldIndex < existingStates.length
                    ? {
                        ...existingStates[oldIndex],
                        char,
                        isNew: false,
                        id: `char-${i}`,
                    }
                    : { char, isNew: false, id: `char-${i}` };
            }
        });
    }

    // Handle the case where text is removed (newText is shorter)
    if (newText.length < oldText.length) {
        // No characters should animate when removing
        return newText.split("").map((char, i) => {
            // Characters before the diff point remain unchanged
            if (i < diffIndex) {
                return i < existingStates.length
                    ? { ...existingStates[i], isNew: false }
                    : { char, isNew: false, id: `char-${i}` };
            } // Characters at/after the diff point are shifted
            else {
                // For removed text, we don't animate any characters
                return { char, isNew: false, id: `char-${i}` };
            }
        });
    }

    // Handle the case where text is replaced (same length but different)
    return newText.split("").map((char, i) => {
        // Only changed characters should animate
        const isChanged = i >= diffIndex;
        return {
            char,
            isNew: isChanged,
            id: isChanged ? `char-${i}-${Date.now()}` : `char-${i}`,
        };
    });
}

/**
 * Converts spaces to non-breaking spaces and handles placeholder
 */
export function getDisplayStates(
    username: string,
    charStates: CharState[],
): CharState[] {
    // Use '_____' as placeholder when there's no username
    return username
        ? charStates.map((state) => ({
            ...state,
            char: state.char === " " ? "\u00A0" : state.char, // Replace space with non-breaking space
        }))
        : "_____".split("").map((char, i) => ({
            char,
            isNew: false,
            id: `placeholder-${i}`,
        }));
}
