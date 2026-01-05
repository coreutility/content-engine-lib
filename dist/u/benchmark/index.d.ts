declare class Benchmark {
    private startTime;
    private endTime;
    private isRunning;
    constructor();
    start(): void;
    stop(): void;
    result(): {
        time_taken_ms: string;
    };
}
export { Benchmark };
