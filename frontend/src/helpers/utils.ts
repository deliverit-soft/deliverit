export const randint = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const range = (min: number, max: number) => Array.from({ length: randint(min, max) }, (_, i) => i + min);

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Format a duration in milliseconds to a human-readable string.
 * @param duration
 */
export function durationFormat(duration: number) {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    const milliseconds = Math.round(duration % 1000);

    if (minutes === 0)
        return `${seconds}s ${String(milliseconds).padStart(3, '0')}ms`;
    else
        return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}


/**
 * Take a list of elements and return a 2D list, with sub-list having at most `size` elements
 * @param elements
 * @param size
 */
export function chunkify<T>(elements: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < elements.length; i += size)
        chunks.push(elements.slice(i, i + size));
    return chunks;
}


/**
 * Same as regular `chunkify`, but with last element from previous chunk repeated in the next one
 * @param elements
 * @param size
 */
export function chunkifyPath<T>(elements: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < elements.length; i += size - 1) {
        const slice = elements.slice(i, i + size);
        if (slice.length > 1)
            chunks.push(slice);
    }
    return chunks;
}
