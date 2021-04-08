import { writeProgressMessage } from 'apply-config';
import { blue, red } from 'chalk';
import { stat } from 'fs';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import { parse } from 'ts-command-line-args';
import { promisify } from 'util';
import { deleteFolder } from './helpers';

interface ICommandArgs {
    sourceFile: string;
    destinationFolder: string;
    force: boolean;
    help: boolean;
}

const statPromisify = promisify(stat);

async function runTests() {
    const args = parse<ICommandArgs>(
        {
            destinationFolder: { type: String, alias: 'd' },
            sourceFile: { type: String, alias: 's' },
            help: { type: Boolean, alias: 'h' },
            force: {
                type: Boolean,
                alias: 'f',
                description: 'Will delete the destination folder before starting if it exists.',
            },
        },
        { helpArg: 'help' }
    );

    await createDestinationFolder(args.destinationFolder, args.force);
}

async function createDestinationFolder(path: string, force: boolean) {
    let progress = writeProgressMessage(`Checking Destination`, false, blue);

    const destinationStat = await statPromisify(path).catch(() => {
        return undefined;
    });

    progress.complete();

    if (destinationStat != null) {
        if (force) {
            progress = writeProgressMessage(`Deleting '${path}'`, true, blue);

            await deleteFolder(path).catch((error) => {
                throw error;
            });

            progress.complete();
        } else {
            console.log(
                red(
                    `Destination '${path}' already exists. Please provide a folder path that does not exist. The folder will be deleted after the test. Run with '-f' to force and delete this folder.`
                )
            );
            process.exit(1);
        }
    }

    progress = writeProgressMessage(`Creating '${path}'`, false, blue);

    await mkdirp(path).catch((error) => {
        throw error;
    });

    progress.complete();
}

runTests();
