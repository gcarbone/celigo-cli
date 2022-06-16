require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='connection <source> <definition>'
exports.describe='Create connection in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    definition: {
        alias: 'd',
        describe: 'Connection definition JSON data',
        demandOption: true
    }
}
exports.handler = async function(args){
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;
    
    console.log('Creating connection...');
    
    await io.createConnection(args.source,args.definition)
    .then(res => {
        console.log(`Created connection id: ${res._id}`);
    })
    .catch(err => {
        console.log(err.response.data);
    });
    
            
}

