var fs = require("fs");
var archiver = require("archiver");

var archive = archiver("zip");
var fileName = "release.zip";
var output = fs.createWriteStream(fileName);

output.on("close", function () {
  console.log(`Bundle ${fileName} has been created.`);
});

archive.on("error", function (err) {
  throw err;
});

archive.pipe(output);
archive.directory("release/", false);
archive.finalize();
