import { exec } from 'child_process';
import { FileCopyTest, FileCopyTestArguments, FileDetails } from '../contracts';

export function linuxNativeParallel(thread?: number): FileCopyTest {
    const threadCount = thread != null ? thread : 1;
    const name = `Linux Native Copy in parallel ${threadCount}`;
    return {
        canRun: process.platform === 'linux' || process.platform === 'darwin',
        description: `child_process.exec('parallel --will-cite -j ${thread} cp sourceFile destinationPath')`,
        name,
        perform: (args: FileCopyTestArguments, fileDetails: FileDetails, runCount: number) =>
            new Promise((resolve, reject) => {
                exec(
                    `find ${fileDetails.path} -type f | parallel --will-cite -j ${threadCount} cp {} "${args.destinationFolder}/"`,
                    (error) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve();
                    }
                );
            }),
    };
}
