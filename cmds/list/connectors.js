require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='connectors <source> [connector]'
exports.describe='List integrations in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    connector: {
        alias: 'c',
        describe: 'Id of connector to list',
        demandOption: false
    }
}
exports.handler = async function(args){
    /*
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;

    if (args.connector){
        console.log('Retreiving integrations:');
        await io.getAssistants(args.source,args.connector)
        .then(res => {
                console.log(columnify(res,{
                columns: ['name','_id']
            }));
            });

    } else {
        await io.getAssistants(args.source)
        .then(res => {
            console.log(res);
            //    console.log(columnify(res,{
            //    columns: ['name','_id']
            //});
            });
        }
        */
    console.log('*not implemented*');   
}

