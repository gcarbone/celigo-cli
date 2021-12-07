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
        alias: 'i',
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
            
            if (args.id){
                await io.getFlows(args.source,args.integration)
                .then(res => {
                    console.log(JSON.stringify(res));
                });
            } else if (args.flowid) {
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

