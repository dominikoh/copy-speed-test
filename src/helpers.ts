import rimraf from 'rimraf';
import { FileDetails, FileInfo } from './contracts';
import { basename } from 'path';
import { promisify } from 'util';
import { readdir, stat } from 'fs';
import { join } from 'path';

export function deleteFolder(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        rimraf(path, (error) => {
            if (error != null) {
                reject(error);
            } else {
                resolve(undefined);
            }
        });
    });
}

export function average(...values: number[]): number {
    return sum(...values) / values.length;
}

export function sum(...values: number[]): number {
    const valueOne = values.shift();
    const valueTwo = values.shift();

    if (valueOne == null) {
        return NaN;
    } else if (valueTwo == null) {
        return valueOne;
    }

    return sum(valueOne + valueTwo, ...values);
}

export function getFileName(path: string): string {
    return basename(path);
}

export async function getFileDetails(path: string): Promise<FileDetails> {
    const stats = await promisify(stat)(path);
    const isFile = !stats.isDirectory();
    let size = stats.size;
    let files: FileInfo[] = [];

    if (isFile) {
        files.push({
            path,
            name: getFileName(path),
            size: stats.size,
        });
    } else {
        files = await getAllFilesInDirectory(path);
        size = files.reduce((total, file) => total + file.size, 0);
    }

    return {
        path,
        name: getFileName(path),
        size: size,
        isFile: isFile,
        files: files,
    };
}

export async function getAllFilesInDirectory(path: string, fileInfo: FileInfo[] = []): Promise<FileInfo[]> {
    const files = await promisify(readdir)(path);

    for (const file of files) {
        const stats = await promisify(stat)(join(path, file));
        if (stats.isDirectory()) fileInfo = await getAllFilesInDirectory(join(path, file), fileInfo);
        else {
            fileInfo.push({
                path: join(path, file),
                name: file,
                size: stats.size,
            });
        }
    }

    return fileInfo;
}

export const kilobyte = 1024;
const bytesRegExp = /^([\d.]+) (\w+)$/;
const unitLookup: Record<string, number> = {
    kB: kilobyte,
    MB: kilobyte * kilobyte,
    GB: kilobyte * kilobyte * kilobyte,
};

export function parseBytes(stringValue: string): number {
    const regExpResult = bytesRegExp.exec(stringValue);
    const unitValue = regExpResult != null ? unitLookup[regExpResult[2]] : undefined;
    const value = regExpResult != null ? parseFloat(regExpResult[1]) : undefined;

    if (regExpResult == null || unitValue == null || value == null || isNaN(value)) {
        throw new Error(
            `Could not parse bytes from '${stringValue}'. Should be in the form '2.3 kB'. Supported units: ${Object.keys(
                unitLookup
            )}`
        );
    }

    return value * unitValue;
}
