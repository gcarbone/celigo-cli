exports.command = 'xform <command>'
exports.desc = 'Transform flow to myAPI (experimental)'
exports.builder = function (yargs) {
  return yargs.commandDir('xform')
}
exports.handler = function (argv) {}