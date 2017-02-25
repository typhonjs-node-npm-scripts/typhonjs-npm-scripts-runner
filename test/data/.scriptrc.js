/**
 * Script runner config file can be CJS formatted.
 *
 * You can provide comments in script runner data files.
 *
 * The entry below is used in testing and used in `./test/scripts/test.js`.
 */
module.exports =
{
   "test":
   {
      "data":
      {
         "scripts":
         [
            "cp ./test/data/empty.js ./test/fixture/empty2.js",
            "cp ./test/data/empty.js ./test/fixture/empty3.js"
         ]
      }
   }
};