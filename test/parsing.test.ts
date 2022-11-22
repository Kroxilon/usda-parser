import {it, expect, test, describe} from 'vitest';

import {
    parse,
    SyntaxError,
} from '@kroxilon/usda-loader';

import {resolve} from "path";
import * as fs from "fs";
import * as process from "process";

// Edit an assertion and save to see HMR in action

test('basic parsing', () => {
    expect(() => {
        parse('#usda 1.0\n');
    }).not.toThrow();
    expect(() => {
        parse('USDC');
    }).to.throw('Expected "#usda " but "U" found.');

    try {
        parse('USDC', {
            filename: 'test.usda',
        });
    } catch (e) {
        expect(e).to.be.instanceof(SyntaxError);
        const syntaxError = e as SyntaxError;

        expect(syntaxError.location).to.deep.eq({
            source: undefined,
            start: {
                column: 1,
                line: 1,
                offset: 0,
            },
            end: {
                column: 2,
                line: 1,
                offset: 1,
            },
        });

        expect(syntaxError.expected).to.deep.eq([
            {
                "ignoreCase": false,
                "text": "#usda ",
                "type": "literal",
            }
        ]);

        expect(syntaxError.name).to.deep.eq('SyntaxError');
        expect(syntaxError.found).to.deep.eq('U');
    }
});

describe('parsing results', () => {
    // language=file-reference
    let paths = [
        './assets/usdPhysicsBoxOnBox.usda',
        './assets/Ball.shadingVariants.usda'
    ];

    for (const path of paths) {
        it(path, () => {
            const resolvedPath = resolve(__dirname, path);
            const fileContents = fs.readFileSync(resolvedPath).toString();

            const parsed = parse(fileContents);
            const jsonPath = resolvedPath + '.json';
            const stringified = JSON.stringify(parsed, null, '  ');

            if(process.env.PRODUCE_RESULTS === 'true') {
                fs.writeFileSync(jsonPath, stringified);
            } else {
                expect(stringified).to.eq(fs.readFileSync(jsonPath).toString());
            }
        })
    }

});

