require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='ierrors <source> [integration]'
exports.describe='List errors for an integration'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    integration: {
        alias: 'i',
        describe: 'Id of integration to list for',
        demandOption: false
    }
}
exports.handler = async function(args){
    
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;

    if (args.integration){
    console.log('Retreiving errors:');
    await io.getIntegrationErrors(args.source,args.integration)
    .then(res => {
            console.log(
               columnify(res, {columns: ['_flowId','numError','lastErrorAt']})
            );
        });

    } 
}

