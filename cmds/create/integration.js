var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='integration <source> <name>'
exports.describe='List flows in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    name: {
        alias: 'n',
        describe: 'Name of integration to create',
        demandOption: true
    }
}
exports.handler = async function(args){
            console.log('Creating integration...');
            
            await io.createIntegration(args.source,args.name)
            .then(res => {
                console.log(`Created integration id: ${res._id}`);
            });
            
            
}

