require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();

exports.command='flows <source> [id]'
exports.describe='Extracts flows from an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    integration: {
        alias: 'i',
        describe: 'Extract flows for one integration Id',
        demandOption: false
    },
    id: {
        alias: 'f',
        describe: 'Flow Id to extract',
        demandOption: false
    },
    name: {
        alias: 'n',
        describe: 'Name of flow to extract',
        demandOption: false
    }
}
exports.handler = async function(args){
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;
    
            if (args.integration){
                await io.getFlows(args.source,args.integration)
                .then(res => {
                    console.log(JSON.stringify(res));
                });
            } else if (args.id) {
                await io.getFlow(args.source,args.id)
                .then(res => {
                    console.log(JSON.stringify(res));
                });
            } else if (args.name) {
                await io.getFlowByName(args.source,args.name)
                .then(res => {
                    console.log(JSON.stringify(res));
                });
            }else {
                await io.getFlows(args.source)
                    .then(res => {
                        console.log(JSON.stringify(res));
                });
            }  
}

