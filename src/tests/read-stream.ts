import { FileCopyTest, FileCopyTestArguments, FileDetails, FileInfo } from '../contracts';
import { join } from 'path';
import { createReadStream, createWriteStream } from 'fs';
import progress from 'progress-stream';
import { ProgressMessage } from 'apply-config';
import formatFileSize from 'pretty-file-size';

const streamCopyFile = (
    file: FileInfo,
    destination: string,
    progressMessage: ProgressMessage,
    highWaterMark?: number
) =>
    new Promise<void>((resolve, reject) => {
        const baseMessage = progressMessage.getMessage();

        const progressStream = progress({
            length: file.size,
            time: 100,
        });

        const readStream = createReadStream(file.path, { highWaterMark });
        const writeStream = createWriteStream(destination);

        readStream.on('error', reject);
        writeStream.on('error', reject);
        writeStream.on('close', resolve);
        progressStream.on('progress', (progress) => {
            const message = `${baseMessage} ${progress.percentage.toFixed(2)}%`;
            progressMessage.updateMessage(message, false);
        });

        readStream.pipe(progressStream).pipe(writeStream);
    });

export function createReadStreamTest(highWaterMark?: number): FileCopyTest {
    const waterMark =
        highWaterMark != null ? formatFileSize(highWaterMark, 0) : `default (${formatFileSize(1024 * 64, 0)})`;
    const name = `fs createReadStream: ${waterMark}`;
    return {
        canRun: true,
        description: `fs.createReadStream(sourceFile).pipe(fs.createWriteStream(destinationPath))`,
        name,
        perform: (
            args: FileCopyTestArguments,
            fileDetails: FileDetails,
            runCount: number,
            progressMessage: ProgressMessage
        ) => {
            return Promise.all(
                fileDetails.files.map((file) => {
                    const destination = join(args.destinationFolder, `${file.name}_fs-createReadStream_${runCount}`);
                    return streamCopyFile(file, destination, progressMessage, highWaterMark);
                })
            ).then(() => undefined);
        },
    };
}
