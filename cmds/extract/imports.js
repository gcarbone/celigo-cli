var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();

exports.command='imports <source> [id]'
exports.describe='Extracts imports from an integrator.io account'
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
    }
}
exports.handler = async function(args){
    if (args.id){
        await io.getImports(args.source,args.id)
        .then(res => {
                console.log(JSON.stringify(res));
            });

    } else {
        await io.getImports(args.source)
        .then(res => {
                console.log(JSON.stringify(res));
            });
    }
}

