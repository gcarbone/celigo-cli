exports.command = 'list <command>'
exports.desc = 'List contents of an integrator.io account'
exports.builder = function (yargs) {
  return yargs.commandDir('list')
}
exports.handler = function (argv) {}