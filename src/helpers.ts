import rimraf from 'rimraf';
import { FileDetails } from './contracts';
import { basename, extname } from 'path';

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

export function getFileDetails(path: string): FileDetails {
    const extension = extname(path);
    const name = basename(path, extension);

    return {
        path,
        name,
        extension,
    };
}
