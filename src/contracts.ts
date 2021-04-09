export type FileCopyTest = {
    readonly name: string;
    readonly perform: (source: string, destination: string) => Promise<void>;
    readonly canRun: boolean;
};

export type TestResult = {
    runs: number[];
    average: number;
};
