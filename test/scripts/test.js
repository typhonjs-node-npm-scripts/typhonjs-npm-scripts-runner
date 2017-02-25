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

// Verify that runner throws exception with bad file array.
thrown = false;
try { runner.run([false, './test/data/.scriptrc'], 'test.data.scripts'); }
catch(err) { thrown = true; }
if (!thrown) { throw new Error('typhonjs-npm-scripts-runner test error: bad file array did not throw exception'); }

// Verify that runner throws exception with bad file array paths.
thrown = false;
try { runner.run(['./test/data/.badfile1', './test/data/.badfile2'], 'test.data.scripts'); }
catch(err) { thrown = true; }
if (!thrown) { throw new Error('typhonjs-npm-scripts-runner test error: bad file array did not throw exception'); }

// ------------------------------------------------------------------------------------------------------------------

// Bare script treated as JSON.
console.log('Testing bare script treated as JSON:');

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

// -------------------------

// Test the message prepend
console.log('\nTesting bare script message prepend:');

runner.run('./test/data/.scriptrc', 'test.data.scripts', 'A custom message -');

fs.emptyDirSync('./test/fixture');

// -------------------------

// Run again with file array with bad first entry
console.log('\nTesting bad file array first entry:');

// Actually run the test of copying files.
runner.run(['./test/data/.badfile1', './test/data/.scriptrc', './test/data/.badfile2'], 'test.data.scripts');

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

// -------------------------

// Test the message prepend
console.log('\nTesting message prepend:');

runner.run('./test/data/.scriptrc', 'test.data.scripts', 'A custom message -');

fs.emptyDirSync('./test/fixture');

// ------------------------------------------------------------------------------------------------------------------

// CJS JS script required.
console.log('\nTesting CJS scriptrc.js require:');

// Actually run the test of copying files.
runner.run('./test/data/.scriptrc.js', 'test.data.scripts');

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

// -------------------------

// Test the message prepend
console.log('\nTesting CJS scriptrc.js require - message prepend:');

runner.run('./test/data/.scriptrc.js', 'test.data.scripts', 'A custom message -');

fs.emptyDirSync('./test/fixture');

// -------------------------

// Run again with file array with bad first entry
console.log('\nTesting CJS bad first entry for file array:');

// Actually run the test of copying files.
runner.run(['./test/data/.badfile1.js', './test/data/.scriptrc.js', './test/data/.badfile2.js'], 'test.data.scripts');

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

// -------------------------

// Test the message prepend
console.log('\nTesting CJS prepend message:');

runner.run('./test/data/.scriptrc.js', 'test.data.scripts', 'A custom message -');

fs.emptyDirSync('./test/fixture');

// -------------------------

// Test that multiple file array only executes first matching file.
console.log('\nTesting JSON file array only executes first matching script:');

// Actually run the test of copying files.
runner.run(['./test/data/.scriptrc', './test/data/.scriptrc2'], 'test.data.scripts');

// Verify that two files were copied and that 'scriptrc2' is not executed.
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

   // Verify that `./test/fixture/empty3.json` exists.
   if (fs.existsSync('./test/fixture/SHOULD_NOT_EXIST.js'))
   {
      throw new Error('`./test/fixture/SHOULD_NOT_EXIST.js` is was copied / scriptrc2 was incorrectly executed.');
   }
}
catch (err)
{
   throw new Error('typhonjs-npm-scripts-runner test error: ' + err);
}

// -------------------------

// Test that multiple file array only executes first matching file.
console.log('\nTesting CJS file array only executes first matching script:');

// Actually run the test of copying files.
runner.run(['./test/data/.scriptrc.js', './test/data/.scriptrc2'], 'test.data.scripts');

// Verify that two files were copied and that 'scriptrc2' is not executed.
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

   // Verify that `./test/fixture/empty3.json` exists.
   if (fs.existsSync('./test/fixture/SHOULD_NOT_EXIST.js'))
   {
      throw new Error('`./test/fixture/SHOULD_NOT_EXIST.js` is was copied / scriptrc2 was incorrectly executed.');
   }
}
catch (err)
{
   throw new Error('typhonjs-npm-scripts-runner test error: ' + err);
}
