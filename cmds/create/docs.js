require("dotenv").config();
var fs = require('fs');
var celigo = require("../../celigo/IntegratorApi.js");
var io = new celigo.IntegratorApi();
var columnify = require("columnify");

exports.command = "docs <source> <id>";
exports.describe = "Create documentation for a flow definition";
exports.builder = {
  source: {
    alias: "s",
    describe: "The API key for the source account",
    demandOption: true,
  },
  id: {
    alias: "i",
    describe: "The ID of the flow to document",
    demandOption: true,
  },
};
exports.handler = async function (args) {
  if (process.env["io." + args.source] != undefined)
    args.source = process.env["io." + args.source];
  else throw `invalid alias '${args.source}'`;

  console.log("Generating documentation...");

  await io.getFlow(args.source, args.id).then(async function (flow) {
    var csv = {
      header:
        "Source System,Source Object,Source,Value,Transform Type,Dest System,Dest Object,Dest Field\n",
      rows: [],
    };
    console.log(flow);
    console.log(csv.header);
    var flowmap = await generateFlowmap(flow);

    const sourceinfo = getSystemInfo(flowmap.sources[0]);
    const destinfo = getSystemInfo(flowmap.destinations[0]);
    const mapping = getMapping(flowmap.destinations[0]);
    csv.rows = mapping.map((xform, index)=>{
        const src = xform.type === 'field'?xform.source:'';
        const val = xform.type !== 'field'?xform.source:'';
        const xform_col = xform.type === 'field'?'Field':xform.type === 'static'?'Static':'Formula';
        
        const row = sourceinfo.system + ',' + 
            sourceinfo.object + ',' + 
            src + ',' + 
            val + ',' +
            xform_col + ',' + 
            destinfo.system + ',' + 
            destinfo.object + ',' + 
            xform.dest;
        return row;
    });
    console.log(csv.rows.join('\n'));
    fs.writeFile(flow.name+'.csv',csv.header + csv.rows.join('\n'),(err =>{
        if (err) throw err;
    }));
  });

  function getMapping(step){
    var mapping = [];

    if (step.adaptorType === 'NetSuiteDistributedImport') {
        mapping = step.netsuite_da.mapping.fields.map((xform,index) =>{
            return {
                source: xform.extract? xform.extract : xform.hardCodedValue,
                dest: xform.generate,
                type: xform.extract?'field':xform.hardCodedValue?'static':'xform'
            }
        })
    }

    return mapping;
  }
  
  function getSystemInfo(step) {
    var system = '';
    var object = '';
    if (step.adaptorType === 'HTTPExport' || step.adaptorType === 'HTTPImport') {
      if (step.assistant) {
        system = step.assistant;
        object = step.assistantMetadata.resource;
      } else {
        system = step.adaptorType;
        object = step.http.relativeURI;
      }
    }
    
    if (step.adaptorType === 'NetSuiteDistributedImport') {
        system = 'NetSuite';
        object = step.netsuite_da.recordType
    }
    return { system, object};
  }

  async function generateFlowmap(flow) {
    var flowmap = {
      flow: flow,
      sources: [],
      destinations: [],
    };

    for await (const step of flow.pageGenerators) {
      const def = await io.getExports(args.source, step["_exportId"]);
      flowmap.sources.push(def);
    }
    for await (const step of flow.pageProcessors) {
      const def = await io.getImports(args.source, step["_importId"]);
      flowmap.destinations.push(def);
    }
    return flowmap;
  }
};
