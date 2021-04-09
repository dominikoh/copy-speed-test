import { writeProgressMessage } from 'apply-config';
import { blue, red } from 'chalk';
import { stat } from 'fs';
import mkdirp from 'mkdirp';
import { parse } from 'ts-command-line-args';
import { promisify } from 'util';
import { testsInSet } from './constants';
import { FileCopyTest, TestResult } from './contracts';
import { average, deleteFolder } from './helpers';
import { winNative } from './tests/win-native';

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

    const tests = [winNative].filter((test) => test.canRun);
    const results: TestResult[] = [];

    for (const test of tests) {
        const result = await runSet(test, args);
        results.push(result);
    }

    await cleanUp(args.destinationFolder);
}

async function runSet(test: FileCopyTest, args: ICommandArgs): Promise<TestResult> {
    const message = `Running Test: ${test.name}`;

    const runs: number[] = [];

    for (let index = 0; index < testsInSet; index++) {
        const runMessage = `${message} ${index + 1}/${testsInSet}`;
        const progress = writeProgressMessage(`${runMessage}`);
        const result = await runTest(test, args);
        runs.push(result);
        progress.complete(true, `${runMessage} (${result})`);
    }

    const averageTime = average(...runs);

    console.log(blue(`${test.name} Average: ${averageTime.toFixed(0)}`));

    return { runs, average: averageTime };
}

async function runTest(test: FileCopyTest, args: ICommandArgs) {
    const testStart = Date.now();
    await test.perform(args.sourceFile, args.destinationFolder);
    const elapsed = Date.now() - testStart;
    return elapsed;
}

async function createDestinationFolder(path: string, force: boolean) {
    let progress = writeProgressMessage(`Checking Destination`, false, blue);

    const destinationStat = await statPromisify(path).catch(() => {
        return undefined; // folder does not exist. Ok to carry on
    });

    progress.complete();

    if (destinationStat != null) {
        if (force) {
            deleteFolder(path);
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

async function cleanUp(path: string) {
    const progress = writeProgressMessage(`Deleting '${path}'`, true, blue);

    await deleteFolder(path).catch((error) => {
        throw error;
    });

    progress.complete();
}

runTests();
