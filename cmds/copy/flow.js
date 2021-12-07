var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='flow <source> <destination> <id>'
exports.describe='Create flow in an integrator.io account'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    destination: {
        alias: 'd',
        describe: 'The API key for the destination account',
        demandOption: true
    },
    id: {
        alias: 'i',
        describe: 'The ID of the flow to copy',
        demandOption: true
    },
    name: {
        alias: 'n',
        describe: 'Rename flow in destination',
        demandOption: false
    },
    active: {
        alias: 'a',
        describe: 'Alter active state (use --no-active to deactivate)',
        type: 'boolean',
        demandOption: false
    }
}
exports.handler = async function(args){
            console.log('Copying flow...');
            
            await io.getFlow(args.source,args.id)
                .then(async function(flow){
                    //console.log(JSON.stringify(flow));
                    var connMap = await getConnMap(args.source, args.destination);
                    var importMap = await createImportMap(flow,args,connMap);
                    //console.log(JSON.stringify(importMap));
                    var exportMap = await createExportMap(flow,args,connMap);
                    //console.log(JSON.stringify(exportMap));
                    var newflow = mapComponent(flow,'_importId',importMap);
                    newflow = mapComponent(newflow,'_exportId',exportMap);
                    //console.log(JSON.stringify(exportMap));
                    //console.log('==============================='); 
                    //console.log(JSON.stringify(newflow));
                    return await io.createFlow(args.source,newflow)
                        .then(res => {
                            console.log("Copied flow to destination with id:" + res._id);
                            return res._id;
                        });
                });
            
            
}

async function createExportMap(flow,args,connMap){
    return await getComponents(flow,'_exportId').reduce(async function(acc,imp){
        var impdef = await io.getExports(args.source,imp)
            .then(res => {
                return res;
            });
        var impdef2 = mapComponent(impdef,'_connectionId',connMap);
        var newid = await io.createExport(args.destination,impdef2)
            .then(res => {
                return res._id;
            });
        acc.push({sourceid:imp,destid:newid});
        return acc;
    },[]);
}

async function createImportMap(flow,args,connMap){
    return await getComponents(flow,'_importId').reduce(async function(acc,imp){
        var impdef = await io.getImports(args.source,imp)
            .then(res => {
                return res;
            });
        var impdef2 = mapComponent(impdef,'_connectionId',connMap);
        var newid = await io.createImport(args.destination,impdef2)
            .then(res => {
                return res._id;
            });
        acc.push({sourceid:imp,destid:newid});
        return acc;
    },[]);
}

async function getConnMap(s, d){
    const scon=s;
    const dcon=d;
    var conMap = [];
    await io.getConnections(scon)
        .then(async function(res){
            res.map(scon => {
                conMap.push({
                    name: scon.name,
                    sourceid: scon._id,
                    destid: ''
                });
            });
        })
        .then(async function(res){
            await io.getConnections(dcon)
                .then(dcon => {
                    dcon.map(con =>{
                        const index = conMap.findIndex(conn => conn.name === con.name);
                        if (index > -1){
                            conMap[index].destid = con._id;
                        };
                    })
                    
                });
            
        });
        return conMap;
}




function getComponents(obj,component) {
    var res = [];
    function recurse(obj, current) {
        if (Array.isArray(obj)) {
            res[current] = obj.map(item =>{
                if (item && typeof item === 'object')
                  return recurse(item,component);
                else
                  return item;
            })
        } else {
            for (const key in obj) {
                let value = obj[key];
                if (value != undefined) {
                    if (value && typeof value === 'object') {
                        if(key === component) res.push(value);
                        const newobj = recurse(value,key);                       
                    } else {
                        // Do your stuff here to var value
                        if (key === component) {
                          res.push(value);
                        }
                        
                    }
                }
            }
        }
    }
    recurse(obj);
    return res;
 }

 function mapComponent(obj,component,connMap) {
    const res = {};
    function recurse(obj, current) {
        if (Array.isArray(obj) ) {
            res[current] = obj.map(item =>{
                if (item && typeof item === 'object')
                  return mapComponent(item,component,connMap);
                else
                  return item;                
            })
        } else {
            for (const key in obj) {
                let value = obj[key];
                if (value != undefined) {
                    if (value && typeof value === 'object') {
                        const newobj = mapComponent(value,component,connMap);
                        res[key] = newobj['undefined'] ? newobj['undefined'] : newobj;
                        
                    } else {
                        // Do your stuff here to var value
                        if (key === component){
                          //console.log(value);
                           const v = connMap.filter(i=>{return i.sourceid === value});
                           //console.log(JSON.stringify((v))) ;
                           value = v.length != 0 ? v[0].destid : 'unknown';  //this shouldn't happen, throw an error
                        }
                        res[key] = value;
                        //console.log(key + '=' + value);
                    }
                }
            }
        }
    }
    recurse(obj);
    return res;
 }
/*
 function nestedLoop(obj) {
    const res = {};
    function recurse(obj, current) {
        if (Array.isArray(obj)) {
            res[current] = obj.map(item =>{
                if (item && typeof item === 'object')
                  return nestedLoop(item);
                else
                  return item;
            })
        } else {
            for (const key in obj) {
                let value = obj[key];
                if (value != undefined) {
                    if (value && typeof value === 'object') {
                        const newobj = nestedLoop(value,key);
                        res[key] = newobj['undefined'] ? newobj['undefined'] : newobj;
                        
                    } else {
                        // Do your stuff here to var value
                        if (key.endsWith('portId')) value = "*" + value;
                        res[key] = value;
                        //console.log(key + '=' + value);
                    }
                }
            }
        }
    }
    recurse(obj);
    return res;
 }
 */