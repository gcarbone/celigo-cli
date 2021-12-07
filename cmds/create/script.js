var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='script <source> <definition>'
exports.describe='Create script in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    definition: {
        alias: 'd',
        describe: 'Script definition JSON data',
        demandOption: true
    }
}
exports.handler = async function(args){
            console.log('Creating integration...');
            
            await io.createScript(args.source,args.definition)
            .then(res => {
                console.log(`Created script id: ${res._id}`);
            });
            
            
}

