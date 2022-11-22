"use strict";
exports.__esModule = true;
var fs = require("fs");
var path_1 = require("path");
var filePath = (0, path_1.resolve)(__dirname, '../src/usda-parser.peggy.ts');
var source = fs.readFileSync(filePath).toString();
fs.writeFileSync(filePath, source
    .replace('public message: string', 'public override message: string')
    .replace('public name: string', 'public override name: string')
    .replace('export type ParseFunction = (input: string, options?: IParseOptions) => any;', 'export type ParseFunction = (input: string, options?: IParseOptions) => USDA_File;'));
