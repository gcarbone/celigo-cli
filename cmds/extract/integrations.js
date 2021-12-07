var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();

exports.command='integrations <source> [id]'
exports.describe='Extracts integrations from an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    id: {
        alias: 'i',
        describe: 'Id of integration to extract',
        demandOption: false
    }
}
exports.handler = async function(args){
    if (args.id){
        await io.getIntegrations(args.source,args.id)
        .then(res => {
                console.log(JSON.stringify(res));
            });

    } else {
        await io.getIntegrations(args.source)
        .then(res => {
                console.log(JSON.stringify(res));
            });
    }
}

