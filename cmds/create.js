exports.command = 'create <command>'
exports.desc = 'Create new integration components'
exports.builder = function (yargs) {
  return yargs.commandDir('create')
}
exports.handler = function (argv) {}