

export function debounce(func: any, wait: number = 250){
    let timeoutId: NodeJS.Timeout | null = null;
    return function(...args: any[]): Promise<any> {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        return new Promise((resolve) => {
            timeoutId = setTimeout(() => {
                const result = func(...args);
                resolve(result);
            }, wait);
        } );
    };
}

export function syncDebounce(func: any, timeout = 300) {
    let timer: any;
    return function(this: any, ...args: any) {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}