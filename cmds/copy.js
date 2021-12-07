exports.command = 'copy <command>'
exports.desc = 'Copy integration components'
exports.builder = function (yargs) {
  return yargs.commandDir('copy')
}
exports.handler = function (argv) {}