require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='export <source> <definition>'
exports.describe='Create export in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    definition: {
        alias: 'd',
        describe: 'Export definition JSON data',
        demandOption: true
    }
}
exports.handler = async function(args){
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;
    
    console.log('Creating integration...');
    
    await io.createExport(args.source,args.definition)
    .then(res => {
        console.log(`Created export id: ${res._id}`);
    });
            
            
}

