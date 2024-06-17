import { exec } from 'child_process';
import { FileCopyTest, FileCopyTestArguments, FileDetails } from '../contracts';

export const linuxNative: FileCopyTest = {
    canRun: process.platform === 'linux' || process.platform === 'darwin',
    description: `child_process.exec('cp sourceFile destinationPath')`,
    name: 'Linux Native Copy',
    perform: (args: FileCopyTestArguments, fileDetails: FileDetails, runCount: number) =>
        new Promise((resolve, reject) => {
            exec(`cp -r "${fileDetails.path}" "${args.destinationFolder}"`, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        }),
};
