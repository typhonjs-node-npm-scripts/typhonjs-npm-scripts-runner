/**
 * Performs a basic tests verifying that bad API usage throws errors then runs the scripts defined in
 * `./test/data/.scriptrc` copying `./test/data/empty.js` twice to `./test/fixture`. If the files exists the test
 * succeeds.
 */

var fs = require('fs-extra');

fs.emptyDirSync('./test/fixture');

var runner = require('../../src/runner');

// Verify that runner throws exception with no parameters.
var thrown = false;
try { runner.run(); }
catch(err) { thrown = true; }
if (!thrown) { throw new Error('typhonjs-npm-scripts-runner test error: missing parameters did not throw exception'); }

// Verify that runner throws exception with missing parameters.
thrown = false;
try { runner.run('.missingparam'); }
catch(err) { thrown = true; }
if (!thrown) { throw new Error('typhonjs-npm-scripts-runner test error: missing parameters did not throw exception'); }

// Verify that runner throws exception with wrong type of parameters.
thrown = false;
try { runner.run(1, 2); }
catch(err) { thrown = true; }
if (!thrown) { throw new Error('typhonjs-npm-scripts-runner test error: wrong types did not throw exception'); }

// Verify that runner throws exception with bad file path.
thrown = false;
try { runner.run('./test/data/.badfile', 'test.data.scripts'); }
catch(err) { thrown = true; }
if (!thrown) { throw new Error('typhonjs-npm-scripts-runner test error: bad file path did not throw exception'); }

// Verify that runner throws exception with bad script entries.
thrown = false;
try { runner.run('./test/data/.scriptrc', 'bogus.data'); }
catch(err) { thrown = true; }
if (!thrown) { throw new Error('typhonjs-npm-scripts-runner test error: bad entries did not throw exception'); }

// Actually run the test of copying files.
runner.run('./test/data/.scriptrc', 'test.data.scripts');

// Verify that two files were copied.
try
{
   // Verify that `./test/fixture/empty2.json` exists.
   if (!fs.statSync('./test/fixture/empty2.js').isFile())
   {
      throw new Error('`./test/fixture/empty2.js` is not a file.');
   }

   // Verify that `./test/fixture/empty3.json` exists.
   if (!fs.statSync('./test/fixture/empty2.js').isFile())
   {
      throw new Error('`./test/fixture/empty2.js` is not a file.');
   }
}
catch (err)
{
   throw new Error('typhonjs-npm-scripts-runner test error: ' + err);
}

// Test the message prepend
runner.run('./test/data/.scriptrc', 'test.data.scripts', 'A custom message -');

fs.emptyDirSync('./test/fixture');