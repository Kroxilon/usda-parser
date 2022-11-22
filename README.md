<h1>@kroxilon/usda-parser</h1>

[![Version](https://img.shields.io/npm/v/@kroxilon/usda-parser?style=flat)](https://www.npmjs.com/package/@kroxilon/usda-parser)
[![Node.js CI](https://github.com/Kroxilon/usda-parser/actions/workflows/node.js.yml/badge.svg?branch=main)](https://github.com/Kroxilon/usda-parser/actions/workflows/node.js.yml)
<!-- [![Downloads](https://img.shields.io/npm/dt/@kroxilon/usda-parser.svg?style=flat)](https://www.npmjs.com/package/@kroxilon/usda-parser) -->

Allows parsing of USDA files in NodeJS and the browser.

```bash
yarn install @kroxilon/usda-parser
```

## Getting Started

```ts
import {parse} from "@kroxilon/usda-parser";

const file = `#usda 1.0
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
}`;

const parseResult = parse(inputFile);

console.log(parsedResult, null, '  ');

```

<details>
<summary>
This should produce:
</summary>

```json
{
  "version": 1,
  "descriptor": {
    "description": null,
    "assignments": [
      {
        "type": "assignment",
        "keyword": null,
        "identifier": "defaultPrim",
        "value": "hello"
      }
    ]
  },
  "statements": [
    {
      "type": "definition",
      "subType": "def",
      "defType": "Xform",
      "name": "hello",
      "args": [],
      "statements": [
        {
          "type": "declaration",
          "keyword": "custom",
          "defineType": "double3",
          "reference": "xformOp:translate",
          "value": [
            4,
            5,
            6
          ],
          "descriptor": null
        },
        {
          "type": "declaration",
          "keyword": "uniform",
          "defineType": "token[]",
          "reference": "xformOpOrder",
          "value": [
            "xformOp:translate"
          ],
          "descriptor": null
        },
        {
          "type": "definition",
          "subType": "def",
          "defType": "Sphere",
          "name": "world",
          "args": [],
          "statements": [
            {
              "type": "declaration",
              "keyword": null,
              "defineType": "float3[]",
              "reference": "extent",
              "value": [
                [
                  -2,
                  -2,
                  -2
                ],
                [
                  2,
                  2,
                  2
                ]
              ],
              "descriptor": null
            },
            {
              "type": "declaration",
              "keyword": null,
              "defineType": "color3f[]",
              "reference": "primvars:displayColor",
              "value": [
                [
                  0,
                  0,
                  1
                ]
              ],
              "descriptor": null
            },
            {
              "type": "declaration",
              "keyword": null,
              "defineType": "double",
              "reference": "radius",
              "value": 2,
              "descriptor": null
            }
          ]
        }
      ]
    }
  ]
}
```
</details>
