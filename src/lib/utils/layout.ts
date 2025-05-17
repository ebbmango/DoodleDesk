/**
 * Checks if text has wrapped to a new line
 * @param welcomeRef Reference to welcome text element
 * @param nameRef Reference to name text element
 * @returns Whether text has wrapped
 */
export function checkWrappedText(
    welcomeRef: HTMLElement | null,
    nameRef: HTMLElement | null,
): boolean {
    if (!welcomeRef || !nameRef) return false;

    const welcomeRange = document.createRange();
    welcomeRange.selectNodeContents(welcomeRef);
    const welcomeRect = welcomeRange.getClientRects()[0];

    const nameRange = document.createRange();
    nameRange.selectNodeContents(nameRef);
    const nameRect = nameRange.getClientRects()[0];

    if (welcomeRect && nameRect) {
        return Math.abs(welcomeRect.top - nameRect.top) > 1;
    }

    return false;
}

/**
 * Calculates optimal font size for text to fit within viewport
 */
export function calculateOptimalFontSize(
    text: string,
    viewportWidth: number,
    defaultFontSize: number,
    minFontSize: number,
    estimateTextWidth: (
        text: string,
        size: number,
        defaultSize: number,
    ) => number,
): number {
    if (!text && !viewportWidth) return defaultFontSize;

    // Add the exclamation mark to the estimation
    const textToMeasure = text + "!";

    // Calculate the maximum available width (with margins)
    const margin = viewportWidth * 0.1; // 10% margin
    const availableWidth = viewportWidth - margin;

    // Check if text would overflow at default size
    const widthAtDefaultSize = estimateTextWidth(
        textToMeasure,
        defaultFontSize,
        defaultFontSize,
    );

    if (widthAtDefaultSize <= availableWidth) {
        // Text fits at default size, no need to reduce
        return defaultFontSize;
    }

    // Text would overflow, calculate the ideal size
    const idealSize = (availableWidth / widthAtDefaultSize) * defaultFontSize;

    // Ensure the size doesn't go below our minimum
    return Math.max(idealSize, minFontSize);
}
