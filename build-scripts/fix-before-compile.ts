import * as fs from 'fs';
import { resolve } from 'path'

let filePath = resolve(__dirname, '../src/usda-parser.peggy.ts');
const source = fs.readFileSync(filePath).toString();

fs.writeFileSync(filePath,
    source
        .replace('public message: string', 'public override message: string')
        .replace('public name: string', 'public override name: string')
        .replace('export type ParseFunction = (input: string, options?: IParseOptions) => any;',
            'export type ParseFunction = (input: string, options?: IParseOptions) => USDA_File;')
);
