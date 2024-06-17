import { FileCopyTest, FileCopyTestArguments, FileDetails } from '../contracts';
import { join } from 'path';
import { copyFile } from 'fs';
import { promisify } from 'util';

export const fsCopyFile: FileCopyTest = {
    canRun: true,
    description: `fs.copyFile(sourceFile destinationPath)`,
    name: 'fs copyfile',
    perform: (args: FileCopyTestArguments, fileDetails: FileDetails, runCount: number) => {
        return Promise.all(
            fileDetails.files.map((file) =>
                promisify(copyFile)(file.path, join(args.destinationFolder, `fs-copy_${runCount}${file.name}`))
            )
        ).then(() => undefined);
    },
};
