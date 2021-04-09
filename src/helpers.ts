import rimraf from 'rimraf';

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
