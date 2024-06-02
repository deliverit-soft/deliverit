export const randint = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const range = (min: number, max: number) => Array.from({ length: randint(min, max) }, (_, i) => i + min);

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
