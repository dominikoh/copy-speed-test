import { FileCopyTest, FileCopyTestArguments, FileDetails } from '../contracts';
import { join } from 'path';
import { copyFile } from 'fs';
import { promisify } from 'util';

export const fsCopyFile: FileCopyTest = {
    canRun: true,
    description: `fs.copyFile(sourceFile destinationPath)`,
    name: 'fs copyfile',
    perform: (args: FileCopyTestArguments, fileDetails: FileDetails, runCount: number) =>
        promisify(copyFile)(
            args.sourceFile,
            join(args.destinationFolder, `${fileDetails.name}_fs-copy_${runCount}${fileDetails.extension}`)
        ),
};
