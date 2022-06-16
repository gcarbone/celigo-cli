#!/usr/bin/env node

var celigo = require('./celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
const yargs = require("yargs");
var columnify = require('columnify')
/*
var argv = yargs
.version('0.0.1')
.usage('usage: $0 <command>')
.demandCommand(1,'Please specify a command (see above for list of commands) or --help')
.command({
    command:'list',
    describe:'List contents of an integrator.io account',
    builder:{
        source: {
            alias: 's',
            describe: 'The API key for the source account',
            demandOption: true
        },
        integration: {
            alias: 'i',
            describe: 'Id of integration',
            demandOption: false
        },
        type:{
            alias: 't',
            describe: 'Type of item',
            demandOption: true,
            choices: ['a','f', 'i'],
            default:'f'
        }
    },
    handler: async function(args){
        switch (args.type) {
           case 'f':
               console.log('Retreiving flows:');
               if (args.integration){
                await io.getIntegrationFlows(args.source,args.integration)
                .then(res => {
                    console.log(columnify(res,{
                        columns: ['name','_id']
                    }));
                });
               } else {
                await io.getFlows(args.source)
                    .then(res => {
                         console.log(columnify(res,{
                            columns: ['name','_id','_integrationId']
                        }));
                });
                }
               break;
            case 'i':
                console.log('Retreiving integrations:');
                await io.getIntegrations(args.source)
                .then(res => {
                     console.log(columnify(res,{
                        columns: ['name','_id']
                    }));
                 });
                 break;
            default:
                console.log('Bad input: type');
       }
    }
})
.command({
    command:'create',
    describe:'List contents of an integrator.io account',
    builder:{
        source: {
            alias: 's',
            describe: 'The API key for the source account',
            demandOption: true
        },
        integration: {
            alias: 'i',
            describe: 'Id of integration',
            demandOption: false
        },
        type:{
            alias: 't',
            describe: 'Type of item',
            demandOption: true,
            choices: ['a','f', 'i'],
            default:'f'
        }
    },
    handler: async function(args){
        switch (args.type) {
           case 'f':
               console.log('Retreiving flows:');
               if (args.integration){
                await io.getIntegrationFlows(args.source,args.integration)
                .then(res => {
                    console.log(columnify(res,{
                        columns: ['name','_id']
                    }));
                });
               } else {
                await io.getFlows(args.source)
                    .then(res => {
                         console.log(columnify(res,{
                            columns: ['name','_id','_integrationId']
                        }));
                });
                }
               break;
            case 'i':
                console.log('Retreiving integrations:');
                await io.getIntegrations(args.source)
                .then(res => {
                     console.log(columnify(res,{
                        columns: ['name','_id']
                    }));
                 });
                 break;
            default:
                console.log('Bad input: type');
       }
    }
});
/*.command({
    command:'copy <type> <source> <destination>',
    describe:'Copy items from source to destination integrator.io account',
    builder:{
        source: {
            alias: 's',
            describe: 'The API key for the source account',
            demandOption: true
        },
        destination:{
            alias: 'd',
            describe: 'The API key for the destination account',
            demandOption: true
        },
        type:{
            alias: 't',
            describe: 'Type of item',
            demandOption: true,
            choices: ['f', 'i'],
            default:'f'
        }
    },
    handler: function(argsv){
        console.log(`Copying ${argsv.type == 'f' ? 'flow' : 'integration'} from ${argsv.source} to ${argsv.destination}`);
    }
})
.help();


argv.parse();

*/

