
type AyFunc = (...args: never[]) => unknown;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 */
export const debounce = <T extends AyFunc>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
    let timeout: number | null = null;

    return (...args: Parameters<T>): void => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
};