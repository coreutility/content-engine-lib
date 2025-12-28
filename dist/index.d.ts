import { editor_p_TYP, hydrator_p_TYP, renderer_p_TYP } from './u/types';
declare const call_0: <K extends "msg">(event: K, ...args: Parameters<{
    msg: (payload: {
        type: string;
        _p?: any;
        _$p?: any;
        custom?: object;
        where?: {
            key: string;
            value: string;
        };
    }) => Promise<void>;
}[K]>) => Promise<void>;
declare const listen_1: <K extends "msg">(event: K, fn: {
    msg: (payload: {
        type: string;
        _p?: any;
        _$p?: any;
        custom?: object;
        where?: {
            key: string;
            value: string;
        };
    }) => Promise<void>;
}[K]) => () => void;
declare const renderer: (_p: renderer_p_TYP) => Promise<{
    set: (_$p: {
        data: {
            l: any[];
        } | any;
    }, _$cb?: {}) => Promise<{
        r: string;
        style: string;
        head: string;
    }>;
}>;
declare const hydrator: (_p: hydrator_p_TYP) => Promise<{
    set: (_$p: {
        data: {
            l: any[];
        } | any;
    }, _$cb?: {}) => Promise<{
        r: string;
        style: string;
    }>;
}>;
declare const editor: (_p: editor_p_TYP) => Promise<{
    set: (_$p: {
        data: {
            l: any[];
        };
    }, _$cb?: {
        change: (_v: any) => any;
    }) => Promise<{
        r: string;
        style: string;
    }>;
}>;
export { renderer as ce_renderer, hydrator as ce_hydrator, editor as ce_editor, call_0 as ce_call, listen_1 as ce_listen, };
