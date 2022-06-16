require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();

exports.command='scripts <source> [id]'
exports.describe='Extracts scripts from an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    id: {
        alias: 'i',
        describe: 'Id of export to extract',
        demandOption: false
    }
}
exports.handler = async function(args){
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;
    
    if (args.id){
        await io.getScripts(args.source,args.id)
        .then(res => {
                console.log(JSON.stringify(res));
            });

    } else {
        await io.getScripts(args.source)
        .then(res => {
                console.log(JSON.stringify(res));
            });
    }
}

