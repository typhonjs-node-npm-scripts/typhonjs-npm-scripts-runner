'use strict';

var cp =                require('child_process');
var fs =                require('fs');
var path =              require('path');
var stripJsonComments = require('strip-json-comments');

/**
 * run -- Provides a NPM module to run commands / scripts defined in an indexed JSON file via `child_process->execSync`.
 *
 * Two command line arguments must be supplied:
 * ```
 * (string|string[]) filePathOrArray - The path or array of paths to a JSON or JS CJS formatted file.
 * (string) scriptEntry - A entry path separated by `.` relative to the root of the JSON file that is an `Array`.
 * (string) messagePrepend - An optional message to prepend instead of the default: `typhonjs-npm-scripts-runner`.
 * ```
 */
module.exports.run = function(filePathOrArray, scriptEntry, messagePrepend)
{
   messagePrepend = typeof messagePrepend === 'string' ? messagePrepend : 'typhonjs-npm-scripts-runner';

   if (typeof filePathOrArray !== 'string' && !Array.isArray(filePathOrArray))
   {
      throw new TypeError(messagePrepend + " error: 'filePathOrArray' is not a 'string' or an 'array'.");
   }

   if (typeof scriptEntry !== 'string')
   {
      throw new TypeError(messagePrepend + " error: 'scriptEntry' is not a 'string'.");
   }

   if (Array.isArray(filePathOrArray))
   {
      var errMessages = '';

      for (var cntr = 0; cntr < filePathOrArray.length; cntr++)
      {
         if (typeof filePathOrArray[cntr] !== 'string')
         {
            throw new TypeError(messagePrepend + " error: 'filePathOrArray[" + cntr + "]: '" + filePathOrArray[cntr] +
             "' is not a 'string'.");
         }

         try
         {
            // If running scripts completes successfully quit early.
            if (runImpl(filePathOrArray[cntr], scriptEntry, messagePrepend)) { return; }
         }
         catch (err)
         {
            errMessages += err.message +'\n';
         }
      }

      // Script runner failed to execute.
      throw new Error(messagePrepend + " failed to execute any scripts: \n" + errMessages);
   }
   else
   {
      runImpl(filePathOrArray, scriptEntry, messagePrepend);
   }
};

/**
 * run -- Provides a NPM module to run commands / scripts defined in an indexed JSON file via `child_process->execSync`.
 *
 * Two command line arguments must be supplied:
 * ```
 * (string) filePath - The path to a JSON formatted file.
 * (string) scriptEntry - A entry path separated by `.` relative to the root of the JSON file that is an `Array`.
 * (string) messagePrepend - An optional message to prepend instead of the default: `typhonjs-npm-scripts-runner`.
 * ```
 */
function runImpl(filePath, scriptEntry, messagePrepend)
{
   var relativeFilePath = path.resolve(process.cwd(), filePath);

   // Verify that `fileName` exists.
   /* istanbul ignore next */
   try
   {
      if (!fs.statSync(relativeFilePath).isFile())
      {
         throw new Error(relativeFilePath + ' not found.');
      }
   }
   catch (err)
   {
      throw new Error(messagePrepend + ' error: ' + err);
   }

   var configInfo;

   // Load `filePath` by requiring if extension name ends in `.js` or as a JSON object stripping any comments.
   if (path.extname(relativeFilePath) === '.js')
   {
      try
      {
         configInfo = require(relativeFilePath);
      }
      catch (err)
      {
         throw new Error(messagePrepend + ' error: ' + err);
      }
   }
   else
   {
      try
      {
         configInfo = JSON.parse(stripJsonComments(fs.readFileSync(relativeFilePath, 'utf-8')));
      }
      catch (err)
      {
         throw new Error(messagePrepend + ' error: ' + err);
      }
   }

   var entries = scriptEntry.split('.');
   var objectWalker = configInfo;
   var entryWalker = '';

   for (var cntr = 0; cntr < entries.length; cntr++)
   {
      entryWalker += (cntr > 0 ? '.' : '') + entries[cntr];

      // Verify that publish entry is an object.
      /* istanbul ignore if */
      if (cntr < entries.length - 1)
      {
         if (typeof objectWalker[entries[cntr]] !== 'object')
         {
            throw new Error(messagePrepend + ' error: `' + entryWalker + '` entry is not an object or is missing in `'
             + filePath + '`.');
         }
      }
      else
      {
         if (!Array.isArray(objectWalker[entries[cntr]]))
         {
            throw new Error(messagePrepend + ' error: `' + entryWalker + '` entry is not an Array or is missing in `'
             + filePath + '`.');
         }
      }

      objectWalker = objectWalker[entries[cntr]];
   }

   // Verify that all array entries are strings.
   for (cntr = 0; cntr < objectWalker.length; cntr++)
   {
      /* istanbul ignore if */
      if (typeof objectWalker[cntr] !== 'string')
      {
         throw new Error(messagePrepend + ' error: `' + entryWalker + '` array entry `' +objectWalker[cntr]
           + '` at index `' + cntr +'` is not a `string` in `' + filePath + '`.');
      }
   }

   // Execute scripts
   for (cntr = 0; cntr < objectWalker.length; cntr++)
   {
      // Build base execution command.
      var exec = objectWalker[cntr];

      // Notify what command is being executed then execute it.
      process.stdout.write(messagePrepend + ' executing: ' + exec + '\n');
      cp.execSync(exec, { stdio: 'inherit' });
   }

   return true;
}

