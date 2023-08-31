require('dotenv').config();
const dayjs = require('dayjs');
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

var celigo = require('../../celigo/IntegratorApi.js');
var io = new celigo.IntegratorApi();
var columnify = require('columnify');
var fs = require('fs');
exports.command='activity <source> [since] [before]'
exports.describe='List recent job executions'
exports.builder={
    source: {
        alias: 's',
        describe: 'The API key for the source account',
        demandOption: true
    },
    since: {
        alias: 'since',
        describe: 'List new jobs created since date/time (example: 2023-07-19T14:21:55.311Z)',
        demandOption: false
    },
    before: {
        alias: 'b',
        describe: 'List new jobs created since date/time (example: 2023-07-19T14:21:55.311Z)',
        demandOption: false
    }
}
exports.handler = async function(args){
    console.log('Retreiving jobs:');
    if (process.env['io.'+args.source] != undefined) 
        args.source = process.env['io.'+args.source];
    else 
        throw `invalid alias '${args.source}'`;

    var date = new dayjs();
    const lastweek = date.subtract(20,'days').startOf('day');
    console.log('current date: '+date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
    console.log(' target date: '+lastweek.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
    
    const flownames = await io.getFlows(args.source);

    var flowmap = new Map();
    for (var i=0;i<flownames.length;i++){
        flowmap.set(flownames[i]._id,flownames[i].name);
    }
    console.log('# of flows = ' + flowmap.size);


    var stepmap = new Map();
    const exportnames = await io.getExports(args.source);
    for (var i=0;i<exportnames.length;i++){
        stepmap.set(exportnames[i]._id,exportnames[i].name);
    }
    
    
    const importnames = await io.getImports(args.source);
    for (var i=0;i<importnames.length;i++){
        stepmap.set(importnames[i]._id,importnames[i].name);
    }
    console.log('# of steps = ' + stepmap.size);

    var jobList = await io.getJobs(args.source, '', '',lastweek.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));

    console.log ('Pass #1 length: '+jobList.length);
    console.log ('first date: '+jobList[0].createdAt);
    console.log (' last date: '+jobList[jobList.length - 1].createdAt);
    if (jobList.length == 1000){
        var lastDate = jobList[jobList.length - 1].createdAt;
        lastDate = new dayjs(lastDate);
        lastDate = lastDate.subtract(0.01,'millisecond');
        var done = false;
        var i = 1;
        while (done == false){
            i += 1;
            var nextList = await io.getJobs(args.source, '', lastDate,lastweek.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'));
            console.log ('Pass #'+ i +' length: '+nextList.length);
            console.log ('first date: '+nextList[0].createdAt);
            console.log (' last date: '+nextList[nextList.length - 1].createdAt);
            lastDate = new dayjs(nextList[nextList.length - 1].createdAt);
            lastDate = lastDate.subtract(0.01,'millisecond').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            jobList = jobList.concat(nextList);
            if (nextList.length < 1000) done = true;
        }
    }
    console.log ('Total Logs: ' + jobList.length);

    var flowJobs = [];
    for (var i=0; i < jobList.length; i++){
        if (jobList[i].type === 'flow'){
            jobList[i].duration = dayjs.duration(new dayjs(jobList[i].endedAt) - new dayjs(jobList[i].startedAt)).format('HH:mm:ss.SSS');
            const flowname = flowmap.get(jobList[i]._flowId);
            jobList[i].flowname = flowname ? flowname : 'No Name';
            var steps = [];
            for (var j=0; j < jobList.length; j++){
                if (jobList[j]._flowJobId === jobList[i]._id){
                    jobList[j].duration = dayjs.duration(new dayjs(jobList[j].endedAt) - new dayjs(jobList[j].startedAt)).format('HH:mm:ss.SSS');
                    const stepname = jobList[j].type === 'import' ? stepmap.get(jobList[j]._importId) : stepmap.get(jobList[j]._exportId);
                    jobList[j].stepname = stepname ? stepname : 'No Name';
                    steps.push(jobList[j]);
                }
            }
            jobList[i].steps = steps.sort((a,b) => {
                    return a.oIndex > b.oIndex ? 1 : -1;
                });
            flowJobs.push(jobList[i]);
            
        }
    }
    console.log ('Total Jobs: ' + flowJobs.length);

    fs.writeFileSync('./flowActivity.json',JSON.stringify(flowJobs, null,'\t'));
    
}

function formatJobs(flowJobs){
    var result = '';
    for (var i=0;i<flowJobs.length;i++){
        result += i+1+':'+ flowJobs[i]._id + '\t' + flowJobs[i].startedAt +'\n';
        for (var j=0;j<flowJobs[i].steps.length;j++){
            result += '\t'+ (j+1) +':'+ flowJobs[i].steps[j].oIndex + '\n';
        }
    }
    return result;
}