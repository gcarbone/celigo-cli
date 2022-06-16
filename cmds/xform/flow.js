require('dotenv').config();
var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');

exports.command='flow <source> <id>'
exports.describe='Transform flow to a myAPI (experimental)'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    id: {
        alias: 'i',
        describe: 'Flow ID to transform',
        demandOption: false
    }
}
exports.handler = async function(args){
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;

    console.log('Transforming flow:');
    var myapi='';
    
    await io.getFlow(args.source,args.id)
        .then(async function(flow) {
            //console.log(JSON.stringify(flow,null,"\t"));
            return await Promise.all(flow.pageProcessors.map(async function(p,i){
                if (p.type === "export"){  
                    return await io.getExports(args.source,p._exportId)
                        .then(step => {
                            return {
                                type: p.type,
                                fname: generateStepFunctionName(step,i),
                                definition: generateStepFunction(p.type, step, p.responseMapping, i)
                            }
                        });
                } else {
                    return await io.getImports(args.source,p._importId)
                        .then(step => {
                            return {
                                type: p.type,
                                fname: generateStepFunctionName(step,i),
                                definition: generateStepFunction(p.type, step, p.responseMapping, i)
                            }
                            
                        });
                }
            }));
            
        }).then(codemap => {
            
            myapi=generateAPI(codemap);
            //console.log(JSON.stringify(codemap,null,'\t'));
            console.log(myapi);
            
        });
        
}
function generateLogger(){
    const proc = `function logger(msg){
        var step='{"_id":"621f98754d834807da3d91b7","createdAt":"2022-03-02T16:16:53.629Z","lastModified":"2022-03-02T17:34:58.127Z","name":"Restdb.io - Create Data Dump","_connectionId":"621f960fc21c5d123cb0f34d","apiIdentifier":"icbffeb954","ignoreExisting":false,"ignoreMissing":false,"oneToMany":false,"sandbox":false,"http":{"relativeURI":["/rest/dump"],"method":["POST"],"body": ["{\n  \"data\":\"___msg___\"\n}"],"batchSize":1,"requestMediaType":"json","successMediaType":"json","errorMediaType":"json","sendPostMappedData":true,"formType":"rest"},"adaptorType":"HTTPImport"}';
        step = handleBodyEscaping(step);
        var stepObject=JSON.parse(step);
        response = imports.runVirtual({import:stepObject});
        return response;   
    }`;
    return proc;
}
function generateHandleQueryEscaping(){
    const proc=`function handleQueryEscaping(step){
        var matches= /"rdbms":{"query":"([.\\s\\S]*)"},"adaptorType"/g.exec(step);
        logger({"matches":matches});
        var escapedbody = matches[1].replace(/"/g,'\\\\"');
        escapedbody = escapedbody.replace(/[\\r\\n]/gm,"");
        var escapedstep = step.replace(matches[1],escapedbody);
        return escapedstep;
    }`;
    return proc;
}

function generateHandleBodyEscaping(){
    const proc=`function handleBodyEscaping(step){
        var matches= /,"body": ?\\["([.\\s\\S]*)"\\],"batchSize"/g.exec(step);
        var escapedbody = matches[1].replace(/"/g,'\\\\"');
        escapedbody = escapedbody.replace(/[\\r\\n]/gm,"");
        var escapedstep = step.replace(matches[1],escapedbody);
        return escapedstep;
    }`;
    return proc;
}
function generateAPI(codemap){
    //console.log(codemap);
    var myapi = `import {accessTokens, asyncHelpers, connections, exports, fileDefinitions, flows, imports, integrations, request, state } from 'integrator-api';\n`;
    myapi += `function handleRequest (options) {\n`;
    myapi += tab()+ `var workspace = {...options.body};` + `\n`;
    for(let i=0;i<codemap.length;i++){
        let s = codemap[i];
        myapi += tab()+ `Object.assign(workspace,${s.fname}(workspace));` + `\n`;       
    }
    myapi += tab()+ `return {
        statusCode: 200,
        headers: { },
        body: {
          input: options.body,
          output:workspace
        }
      }`;
    myapi += tab()+ `` + `\n`;
    myapi += `}` + `\n`;
    for(let i=0;i<codemap.length;i++){
        let s = codemap[i];
        myapi += s.definition + `\n`;       
    }
    //myapi += generateHandleHandlebars() + `\n`;
    myapi += generateNormalizeHandlebarReferences() + `\n`;
    myapi += generateLogger() + `\n`;
    myapi += generateHandleBodyEscaping() + `\n`;
    myapi += generateHandleQueryEscaping() + `\n`;
    return myapi;
}



function generateStepFunctionName(step, index){
    //console.log(step);
    return `exec${step.adaptorType}${step.name.replace(/\s/g,'').replace(/[\W]/g,'_')}_${index}`;
}

function generateStepFunction(type, step, map, index){
    var func = `function ${generateStepFunctionName(step,index)}(workspace){\n`;
    if (type == 'export') {
        func += tab()+`var step=\`${JSON.stringify(step)}\`;\n`;
        func += tab()+`var procStep=normalizeHandlebarReferences(step);\n`;
        if (step.adaptorType == 'RDBMSExport') func += tab()+`procStep=handleQueryEscaping(procStep);\n`;
        func += tab()+`var stepObject=JSON.parse(procStep);\n`;       
    }   
    func += tab()+`var response={};\n`;
    func += tab()+`try {\n`;
    switch (type){
        case 'export' :
            func += tab()+tab()+`response = exports.runVirtual({export:stepObject, data:workspace});\n`;
            break;
        case 'import' :
            func += tab()+tab()+`response = imports.run({_id:"${step._id}",data:workspace});\n`;
            break;
    }
    func += map.fields.reduce((acc,field) =>{
        return acc += tab()+tab()+`response.${field.generate} = response.${field.extract};\n`;
    },"");
   
    func += tab()+`}catch(e) {\n`;
    func += tab()+tab()+`response = JSON.stringify(e)\n`;
    
    func += tab()+`}\n`;
    func += tab()+`return response;\n`;
    func += `}\n`;


    //console.log(func);
    return func;
}

function generateHandleHandlebars(){
    var func=`function handleHandlebars(value, workspace){
        let data={ "record":workspace  };
        //var matches=value.match(/{{{?(#[a-z]+ )?[a-z]+.[a-z]*}?}}/g);
        var matches=value.match(/{{{?[\\s\\S]+?}?}}/g);
        matches.forEach((match, index) =>{
          if (match != undefined & match.search(' ') === -1){
            var symbol = match.replace(/[{}]/g,'');
            var schain = symbol.split('.');
            var path = data;
            schain.forEach((s,i) =>{
              path=path[s];
            })
            value=value.replace(match,path);
          }
        })
        return value;
      }`;
      return func;
}

function generateNormalizeHandlebarReferences(){
    var func=`function normalizeHandlebarReferences(data){
        //return data.replace(/{{.*?(record|data)(.*?)}}/gm,'{{data.data$2}}');
        return data.replace(/({{{?).*?(data.|record.)?([\\S]+)\\s*?(}}}?)/gm,'$1data.data.$3$4');
      }`;
    return func;
}

function generateLogger(){
    var func=`function logger(msg){
        var response={};
        try {
           response = imports.run({_id:"6226665b6c1095151788ac93",data:msg});
        }catch(e) {
           response = JSON.stringify(e)
        }
        return response;
     }`;
     return func;
}

function tab(num=1){
    var spaces = "";
    for(let i=0;i<num;i++){
        spaces += "   ";
    }
    return spaces;
}