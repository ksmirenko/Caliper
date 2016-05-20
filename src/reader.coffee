path = require 'path'
minidump = require './minidump'
cache = require './cache'

module.exports.getStackTraceFromRecord = (record, callback) ->
  return callback(null, cache.get(record.id)) if cache.has record.id

  # assuming we are in /lib directory and minidump_stackwalk in /bin
  dumpPath = path.join __dirname, "..", record.path
  symbolPaths = [ path.join __dirname, "..", "pool", "symbols" ]
  minidump.walkStack dumpPath, symbolPaths, (err, report) ->
    cache.set record.id, report unless err?
    callback err, report
