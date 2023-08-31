require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='jobs <source> [type] [since]'
exports.describe='List recent job executions'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    type: {
        alias: 't',
        describe: 'Job type (i.e. flow, import, export, etc)',
        demandOption: false
    },
    since: {
        alias: 'since',
        describe: 'List new jobs created since date/time (example: 2023-07-19T14:21:55.311Z)',
        demandOption: false
    }
}
exports.handler = async function(args){
    
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;

    
    console.log('Retreiving jobs:');

    await io.getJobs(args.source, args.type, args.since)
    .then(res => {
            console.log(
            res // columnify(res, {columns: ['_flowId','numError','lastErrorAt']})
            );
        })
     
}

