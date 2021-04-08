import { parse } from 'ts-command-line-args';

interface ICommandArgs {
    sourceFile: string;
    destinationFolder: string;
    help?: boolean;
}

const args = parse<ICommandArgs>(
    {
        destinationFolder: { type: String, alias: 'd' },
        sourceFile: { type: String, alias: 's' },
        help: { type: Boolean, optional: true, alias: 'h' },
    },
    { helpArg: 'help' }
);

console.log(args);
