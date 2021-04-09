import { writeProgressMessage } from 'apply-config';
import { blue, red } from 'chalk';
import { stat } from 'fs';
import mkdirp from 'mkdirp';
import { parse } from 'ts-command-line-args';
import { promisify } from 'util';
import { defaultTestsInSet } from './constants';
import { FileCopyTest, FileCopyTestArguments, FileDetails, TestResult } from './contracts';
import { average, deleteFolder, getFileDetails } from './helpers';
import { fsCopyFile } from './tests/fs-copy';
import { winNative } from './tests/win-native';

const statPromisify = promisify(stat);

async function runTests() {
    const args = parse<FileCopyTestArguments>(
        {
            destinationFolder: { type: String, alias: 'd' },
            sourceFile: { type: String, alias: 's' },
            help: { type: Boolean, alias: 'h' },
            force: {
                type: Boolean,
                alias: 'f',
                description: 'Will delete the destination folder before starting if it exists.',
            },
            testsInSet: { type: Number, defaultValue: defaultTestsInSet },
        },
        { helpArg: 'help' }
    );

    await createDestinationFolder(args.destinationFolder, args.force);

    // Todo read file size and print

    const fileDetails = getFileDetails(args.sourceFile);

    await runSets(args, fileDetails);

    await cleanUp(args.destinationFolder);
}

async function runSets(args: FileCopyTestArguments, fileDetails: FileDetails) {
    const tests = [winNative, fsCopyFile].filter((test) => test.canRun);
    const results: TestResult[] = [];

    for (const test of tests) {
        const result = await runSet(test, args, fileDetails);
        results.push(result);
    }
}

async function runSet(test: FileCopyTest, args: FileCopyTestArguments, fileDetails: FileDetails): Promise<TestResult> {
    const message = `Running Test: ${test.name}`;

    const runs: number[] = [];

    for (let index = 0; index < args.testsInSet; index++) {
        const runCount = index + 1;
        const runMessage = `${message} ${runCount}/${args.testsInSet}`;
        const progress = writeProgressMessage(`${runMessage}`);
        const result = await runTest(test, args, fileDetails, runCount);
        runs.push(result);
        progress.complete(true, `${runMessage} (${result})`);

        await new Promise((resolve) => setTimeout(resolve, 500)); // wait between each test
    }

    const averageTime = average(...runs);
    const best = Math.min(...runs);

    console.log(blue(`${test.name} Average: ${averageTime.toFixed(0)} Best: ${best}`));

    return { runs, average: averageTime, best };
}

async function runTest(test: FileCopyTest, args: FileCopyTestArguments, fileDetails: FileDetails, runCount: number) {
    const testStart = Date.now();
    await test.perform(args, fileDetails, runCount);
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
