import { exec } from 'child_process';
import { FileCopyTest, FileCopyTestArguments, FileDetails } from '../contracts';
import { join } from 'path';

export const winNative: FileCopyTest = {
    canRun: process.platform === 'win32',
    description: `child_process.exec('copy sourceFile destinationPath')`,
    name: 'Windows Native Copy',
    perform: (args: FileCopyTestArguments, fileDetails: FileDetails, runCount: number) =>
        new Promise((resolve, reject) => {
            const fileName = `${fileDetails.name}_winNative_${runCount}`;
            exec(`copy "${args.sourceFile}" "${join(args.destinationFolder, fileName)}"`, (error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        }),
};
