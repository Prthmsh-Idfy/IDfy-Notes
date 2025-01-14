

export function debounce(func: any, wait: number = 250): any{
    let timeoutId: NodeJS.Timeout | null = null;

    return async function executedFunction(this: any, ...args: any[]){
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(async() => {
            await func.apply(this, args); 
        }, wait);
    };
}
