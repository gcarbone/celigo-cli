exports.command = 'set <command>'
exports.desc = 'Set environment aliases'
exports.builder = function (yargs) {
  return yargs.commandDir('set')
}
exports.handler = function (argv) {}