declare const index: () => Promise<{
    set: (_pp: {
        /**eg => dark, light */
        name: string;
        el_id: string;
    }) => Promise<void>;
}>;
export { index as theme };
