export type FileCopyTest = {
    name: string;
    perform: (source: string, destination: string) => Promise<void>;
};
