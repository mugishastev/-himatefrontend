export const debounce = <T extends (...args: any[]) => any>(
    fn: T,
    delay: number
) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

export const classNames = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(' ');
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
