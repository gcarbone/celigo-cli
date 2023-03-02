require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='users <source>'
exports.describe='List users in an integrator.io account'
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
    
    console.log('Retreiving users:');
    
    await io.getUsers(args.source)
        .then(res => {
            const users = res.map((user) => {
                return {...user,...user.sharedWithUser}
            });
            console.log(columnify(users,{
                columns: ['_id','email']
            }));
    });
            
}

