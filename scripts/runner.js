'use strict';

/**
 * runner -- Provides a NPM script that defers to the module implementation.
 *
 * Two command line arguments must be supplied:
 * ```
 * (string) filePath - The path to a JSON formatted file.
 * (string) scriptEntry - A entry path separated by `.` relative to the root of the JSON file that is an `Array`.
 * ```
 */

var runner = require('../src/runner');

if (typeof process.argv[2] !== 'string')
{
   throw new TypeError('typhonjs-npm-script-runner error: argument `file path` is missing or not a `string`.');
}

if (typeof process.argv[3] !== 'string')
{
   throw new TypeError('typhonjs-npm-script-runner error: argument `script entry` is missing or not a `string`.');
}

runner.run(process.argv[2], process.argv[3]);