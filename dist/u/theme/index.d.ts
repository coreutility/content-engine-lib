declare const index: () => Promise<{
    set: (_$p: {
        /**eg => dark, light */
        name: string;
        el_id: string;
    }) => Promise<void>;
}>;
export { index as theme };
