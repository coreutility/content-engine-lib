import { Emitter } from '../emitter';
declare const index: () => Emitter<{
    msg: (payload: {
        /**eg=> `change`, `add`  etc. */
        type: string;
        /**can pass existing `_p` variable. */
        _p?: any;
        /**can pass existing `_pp` variable. */
        _pp?: any;
        /**can be used to pass custom data. */
        custom?: any;
        /**can create condition for listeners */
        where?: {
            /**eg=> @id (Module-Id), @type (Module-Type) */
            key: string;
            /**eg=> xx776-6564-6547 (Module-Id), text (Module-Type) */
            value: string;
        };
        /**can be used to pass eg=> `_pp[`data`].curr[`data`],`, `_pp[`data`].curr` */
        $d?: any;
        /**can be used to pass eg=> `HTMLElement` */
        el?: any;
    }) => Promise<void>;
}>;
export { index as new_emitter };
