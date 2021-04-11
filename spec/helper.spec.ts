import formatFileSize from 'pretty-file-size';
import { kilobyte, parseBytes } from '../src/helpers';

describe('helpers', () => {
    describe('parseBytes', () => {
        const tests = [
            kilobyte,
            kilobyte * 64,
            kilobyte * kilobyte,
            kilobyte * kilobyte * 100,
            kilobyte * kilobyte * kilobyte,
            kilobyte * kilobyte * kilobyte * 100,
        ];

        tests.forEach((test) => {
            const stringValue = formatFileSize(test);
            it(`should return ${test} given '${stringValue}'`, () => {
                expect(parseBytes(stringValue)).toBe(test);
            });
        });

        it('should throw an error when incorrect string passed', () => {
            expect(() => parseBytes('not a value')).toThrowError(
                `Could not parse bytes from 'not a value'. Should be in the form '2.3 kB'. Supported units: kB,MB,GB`
            );
        });
    });
});
