import { hydrator_p_TYP, renderer_p_TYP } from './u/types';
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
        $d?: any;
        el?: any;
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
        $d?: any;
        el?: any;
    }) => Promise<void>;
}[K]) => () => void;
declare const renderer: (_p: renderer_p_TYP) => Promise<{
    set: (_$p: {
        data: {
            l: any[];
        } | any;
        return?: {
            r?: "full" | "chunk";
        };
    }) => Promise<{
        r: any;
        style: string;
        head: string;
        benchmark: any;
    }>;
}>;
declare const hydrator: (_p: hydrator_p_TYP) => Promise<{
    set: (_$p: {
        data: {
            l: any[];
        } | any;
    }) => Promise<{
        benchmark: {
            time_taken_ms: string;
        };
    }>;
}>;
export { renderer as ce_renderer, hydrator as ce_hydrator, call_0 as ce_call, listen_1 as ce_listen, };
