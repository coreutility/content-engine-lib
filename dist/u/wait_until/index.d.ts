declare function index(conditionFn: () => boolean, interval?: number): Promise<void>;
export { index as wait_until };
