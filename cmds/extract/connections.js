require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();

exports.command='connections <source> [id]'
exports.describe='Extracts connections from an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    id: {
        alias: 'i',
        describe: 'Id of import to extract',
        demandOption: false
    },
    name: {
        alias: 'n',
        describe: 'Name of import to extract',
        demandOption: false
    }
}
exports.handler = async function(args){
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;
    
    if (args.id){
        await io.getConnections(args.source,args.id)
        .then(res => {
                console.log(JSON.stringify(res));
            });

    } else if (args.name){
        await io.getConnectionByName(args.source,args.name)
        .then(res => {
                console.log(JSON.stringify(res));
            });
    } else {
        await io.getConnections(args.source)
        .then(res => {
                console.log(JSON.stringify(res));
        });
    }
}

