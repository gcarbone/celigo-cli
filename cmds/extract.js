exports.command = 'extract <command>'
exports.desc = 'Export component definitions'
exports.builder = function (yargs) {
  return yargs.commandDir('extract')
}
exports.handler = function (argv) {}