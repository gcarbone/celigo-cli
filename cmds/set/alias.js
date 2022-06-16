require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');
const fs = require('fs') 

const sourcePath = '.env'

exports.command='alias <alias> <key>'
exports.describe='Set API key alias'
exports.builder={
    alias: {
        alias: 'a',
        describe: 'API key alias',
        demandOption: true
    },
    key: {
        alias: 'k',
        describe: 'The API key for the integrator.io account',
        demandOption: true
    }
    
}
exports.handler = async function(args){
    
        process.env['io.'+ args.alias] = args.key;
        var env = Object.keys(process.env).filter((k) => {return k.match(/^io\..+/)}).reduce((acc,key) => {
            return acc + key + '=' + process.env[key] + '\n';
        },'');

        console.log(env);
        fs.writeFileSync(sourcePath,env,{encoding:'utf8',flag:'w'})
}

