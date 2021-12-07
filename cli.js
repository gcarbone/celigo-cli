#!/usr/bin/env node
require('yargs/yargs')(process.argv.slice(2))
.version('0.0.1')  
.commandDir('./cmds')
.demandCommand(1)
.help()
.argv
