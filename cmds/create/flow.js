var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='flow <source> <definition>'
exports.describe='Create flow in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    definition: {
        alias: 'd',
        describe: 'Flow definition JSON data',
        demandOption: true
    }
}
exports.handler = async function(args){
            console.log('Creating integration...');
            
            await io.createFlow(args.source,args.definition)
            .then(res => {
                console.log(`Created flow id: ${res._id}`);
            });
            
            
}

