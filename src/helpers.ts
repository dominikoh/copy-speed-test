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
