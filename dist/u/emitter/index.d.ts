type AsyncFn = (...args: any[]) => Promise<any> | any;
declare class index<T extends Record<string, AsyncFn>> {
    private listeners;
    on: <K extends keyof T>(event: K, fn: T[K]) => () => void;
    off: <K extends keyof T>(event: K, fn: T[K]) => void;
    /** Sequential execution (await each listener) */
    emit: <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => Promise<void>;
    /** Parallel execution (await all listeners) */
    emitParallel: <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => Promise<void>;
    emitSafe: <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => Promise<void>;
}
export { index as Emitter };
