import { Emitter } from '../emitter';
declare const index: () => Emitter<{
    msg: (payload: {
        /**eg=> `on:change`, `on:add`  etc. */
        type: string;
        /**can pass existing `_p` variable. */
        _p?: any;
        /**can pass existing `_$p` variable. */
        _$p?: any;
        /**can be used to pass custom data. */
        custom?: object;
        /**can create condition for listeners */
        where?: {
            /**eg=> @id (Module-Id), @type (Module-Type) */
            key: string;
            /**eg=> xx776-6564-6547 (Module-Id), text (Module-Type) */
            value: string;
        };
    }) => Promise<void>;
}>;
export { index as get_emitter };
