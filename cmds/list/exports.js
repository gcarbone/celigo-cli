require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='exports <source>'
exports.describe='List exports in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    }
}
exports.handler = async function(args){
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;
    
    console.log('Retreiving exports:');
    
    await io.getExports(args.source)
        .then(res => {
            console.log(columnify(res,{
                columns: ['name','_id','adaptorType']
            }));
    });
            
}

