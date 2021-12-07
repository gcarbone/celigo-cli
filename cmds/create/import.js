var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='import <source> <definition>'
exports.describe='Create import in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    definition: {
        alias: 'd',
        describe: 'import definition JSON data',
        demandOption: true
    }
}
exports.handler = async function(args){
            console.log('Creating integration...');
            
            await io.createImport(args.source,args.definition)
            .then(res => {
                console.log(`Created import id: ${res._id}`);
            });
            
            
}

