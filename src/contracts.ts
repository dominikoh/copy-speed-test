export type FileCopyTestArguments = {
    sourceFile: string;
    destinationFolder: string;
    force: boolean;
    help: boolean;
    testsInSet: number;
};

export type FileDetails = {
    path: string;
    name: string;
    extension: string;
};

export type FileCopyTest = {
    readonly name: string;
    readonly perform: (args: FileCopyTestArguments, fileDetails: FileDetails, runCount: number) => Promise<void>;
    readonly canRun: boolean;
};

export type TestResult = {
    runs: number[];
    average: number;
    best: number;
};
