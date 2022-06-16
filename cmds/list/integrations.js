require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='integrations <source> [integration]'
exports.describe='List integrations in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    integration: {
        alias: 'i',
        describe: 'Id of integration to list',
        demandOption: false
    }
}
exports.handler = async function(args){
    
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;

    if (args.integration){
    console.log('Retreiving integrations:');
    await io.getIntegrations(args.source,args.integration)
    .then(res => {
            console.log(columnify(res,{
            columns: ['name','_id']
        }));
        });

    } else {
        await io.getIntegrations(args.source)
    .then(res => {
            console.log(columnify(res,{
            columns: ['name','_id']
        }));
        });
    }
}

