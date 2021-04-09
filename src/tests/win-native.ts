import { FileCopyTest } from '../contracts';

export const winNative: FileCopyTest = {
    canRun: true,
    name: 'Windows Native Copy',
    perform: () =>
        new Promise((resolve) => {
            setTimeout(resolve, 1500);
        }),
};
