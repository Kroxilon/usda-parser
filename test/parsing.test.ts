import {it, expect, test, describe} from 'vitest';

import {
    parse,
    SyntaxError,
} from '@kroxilon/usda-parser';

import {resolve} from "path";
import * as fs from "fs";
import * as process from "process";

// Edit an assertion and save to see HMR in action

test('basic parsing', () => {
    expect(() => {
        parse('#usda 1.0\n');
    }).not.toThrow();

    expect(() => {
        parse(`#usda 1.0
(
    defaultPrim = "hello"
)

def Xform "hello"
{
    custom double3 xformOp:translate = (4, 5, 6)
    uniform token[] xformOpOrder = ["xformOp:translate"]

    def Sphere "world"
    {
        float3[] extent = [(-2, -2, -2), (2, 2, 2)]
        color3f[] primvars:displayColor = [(0, 0, 1)]
        double radius = 2
    }
}`);
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

// @ts-ignore
const usdaFiles: Record<string, () => string> = import.meta.glob('./assets/**/*.usda', {as: 'raw'})

describe('parsing results', () => {
    for (const [path, contentsGetter] of Object.entries(usdaFiles)) {
        it(path, async () => {
            const contents = await contentsGetter();
            const parsed = parse(contents);
            const resolvedPath = resolve(__dirname, path);
            const jsonPath = resolvedPath + '.json';
            const stringified = JSON.stringify(parsed, null, '  ');

            if (process.env.PRODUCE_RESULTS === 'true') {
                fs.writeFileSync(jsonPath, stringified);
            } else {
                expect(stringified).to.eq(fs.readFileSync(jsonPath).toString());
            }
        })
    }

});

