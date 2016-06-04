![typhonjs-npm-scripts-runner](https://i.imgur.com/kr1m1lD.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-npm-scripts-runner.svg?label=npm)](https://www.npmjs.com/package/typhonjs-npm-scripts-runner)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-npm-scripts/typhonjs-npm-scripts-runner/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-npm-scripts/typhonjs-npm-scripts-runner.svg?branch=master)](https://travis-ci.org/typhonjs-node-npm-scripts/typhonjs-npm-scripts-runner)
[![Dependency Status](https://www.versioneye.com/user/projects/57525a757757a00041b3a222/badge.svg?style=flat)](https://www.versioneye.com/user/projects/57525a757757a00041b3a222)

Provides an NPM module and script which will load a JSON file searching for an Array entry then executes commands by `child_process->execSync`. 

For a comprehensive ES6 build / testing / publishing NPM module please see [typhonjs-npm-build-test](https://www.npmjs.com/package/typhonjs-npm-build-test) as it combines this module along with transpiling ES6 sources with Babel, pre-publish script detection, ESDoc dependencies, testing with Mocha / Istanbul and an Istanbul instrumentation hook for JSPM / SystemJS tests. For a full listing of all TyphonJS NPM script modules available please see [typhonjs-node-npm-scripts](https://github.com/typhonjs-node-npm-scripts) organization on GitHub.

------

To configure the script runner provide this entry in `package.json` scripts entry:

```
  "devDependencies": {
    "typhonjs-npm-scripts-runner": "^0.1.0"
  },
  "scripts": {
    "runme": "node ./node_modules/typhonjs-npm-scripts-runner/scripts/runner.js <file path> <script entry>",
  },
```

`<file path>` must be defined relative to the root path and contain a JSON formatted object hash with entries that end with an `Array` of `strings`. To invoke the above example execute `npm run runme`.

For example here is a JSON formatted file `.scriptdata` located in the root path with muliple entries. The first `copy.files.scripts` copies files the second `run.npm` runs three other NPM scripts defined in `package.json`:
```
/**
 * You can provide comments in script runner data files.
 */
{
   "copy":
   {
      "files":
      {
         "scripts":
         [
            "cp ./templates/file2.js ./destination/file2.js",
            "cp ./templates/file2.js ./destination/file3.js"
         ]
      }
   },
   
   "run":
   {
      "scripts": ["npm run script1", "npm run script2", "npm run script3"]
   }
}
```

Given the above data file here are the entries in `package.json` to run them:

```
  "scripts": {
    "copy": "node ./node_modules/typhonjs-npm-scripts-runner/scripts/runner.js .scriptdata copy.files.scripts '<optional custom message>'",
    "runmult": "node ./node_modules/typhonjs-npm-scripts-runner/scripts/runner.js .scriptdata run.scripts '<optional custom message>'"
  },
```

For programmatic usage see the following example; you may include a 3rd string parameter for a custom message:
```
var runner = require('typhonjs-npm-scripts-runner');

runner.run('.scriptdata', 'copy.files.scripts', '<optional custom message>');
```

Please note that you can add comments to the script JSON data file. 
