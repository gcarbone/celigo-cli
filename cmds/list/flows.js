var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='flows <source> [integration]'
exports.describe='List flows in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    integration: {
        alias: 'i',
        describe: 'Display flows for one integration Id',
        demandOption: false
    }
}
exports.handler = async function(args){
            console.log('Retreiving flows:');
            if (args.integration){
            await io.getFlows(args.source,args.integration)
            .then(res => {
                console.log(columnify(res,{
                    columns: ['name','_id']
                }));
            });
            } else {
            await io.getFlows(args.source)
                .then(res => {
                        console.log(columnify(res,{
                        columns: ['name','_id','_integrationId']
                    }));
            });
            }  
}

