/*
  Copyright (c) 2013 GitHub Inc.

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  "Software"), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var searchPaths = [
  path.resolve(__dirname, '..', 'bin'),
  path.resolve(__dirname, '..', 'build', 'Release'),
  path.resolve(__dirname, '..', 'build', 'Debug'),
];

function searchCommand(command) {
  if (process.platform == 'win32') {
    command += '.exe'
    var binaryPath = path.join(__dirname, '..', 'bin', command)
    if (fs.existsSync(binaryPath))
      return binaryPath;
  } else {
    for (var i in searchPaths) {
      var binaryPath = path.join(searchPaths[i], command);
      if (fs.existsSync(binaryPath))
        return binaryPath;
    }
  }
}

function execute(command, args, callback) {
  console.log("Directory: " + __dirname); // DEBUG CODE
  var stdout = new Buffer(0);
  var stderr = new Buffer(0);
  var child = spawn(command, args);
  child.stdout.on('data', function(chunk) {
    stdout = Buffer.concat([stdout, chunk]);
  });
  child.stderr.on('data', function(chunk) {
    stderr = Buffer.concat([stderr, chunk]);
  });
  child.on('close', function(code) {
    if (code != 0) {
      callback(stderr ? new Error(stderr.toString()) : new Error("Command `" + command + "` failed: " + code));
    }
    else
      callback(null, stdout);
  });
}

var globalSymbolPaths = [];
module.exports.addSymbolPath = Array.prototype.push.bind(globalSymbolPaths);

module.exports.walkStack = function(minidump, symbolPaths, callback) {
  if (!callback) {
    callback = symbolPaths;
    symbolPaths = [];
  }

  var stackwalk = searchCommand('minidump_stackwalk');
  if (!stackwalk) {
    callback('Unable to find the "minidump_stackwalk"');
    return;
  }

  args = [minidump].concat(symbolPaths, globalSymbolPaths)
  execute(stackwalk, args, callback);
}

module.exports.dumpSymbol = function(binary, callback) {
  var dumpsyms = searchCommand('dump_syms');
  if (!dumpsyms) {
    callback('Unable to find the "dump_syms"');
    return;
  }

  // Search for binary.dSYM on OS X.
  dsymPath = binary + '.dSYM';
  if (process.platform == 'darwin' && fs.existsSync(dsymPath))
    binary = dsymPath;

  execute(dumpsyms, ['-r', '-c', binary], callback)
}
