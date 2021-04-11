import prettyFileSize from 'pretty-file-size';
import { ArgumentConfig } from 'ts-command-line-args';
import { FileCopyTestArguments } from './contracts';

export const defaultTestsInSet = 3;

const oneMb = 1024 * 1024;
const defaultHighWaterMark = [oneMb, oneMb * 100, oneMb * 500, oneMb * 1000].map(prettyFileSize);

export const parseArgs: ArgumentConfig<FileCopyTestArguments> = {
    destinationFolder: { type: String, alias: 'd' },
    sourceFile: { type: String, alias: 's' },
    help: { type: Boolean, alias: 'h' },
    force: {
        type: Boolean,
        alias: 'f',
        description: 'Will delete the destination folder before starting if it exists.',
    },
    testsInSet: { type: Number, defaultValue: defaultTestsInSet },
    highWaterMark: {
        type: String,
        multiple: true,
        defaultValue: defaultHighWaterMark,
        description: `An Array of highwatermark values to run the createReadStream test at. Defaults to ${defaultHighWaterMark}. Set multiple values as follows: '--highWaterMark="50 kB,150 MB,1 GB"'`,
    },
};
