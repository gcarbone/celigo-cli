const axios = require('axios');
const proxyUri = 'http://localhost:8080/';
const baseUri='https://api.integrator.io/v1/';



class IntegratorApi {

    async getIntegrations(apikey,intkey = ''){
        
        return axios({
            url: baseUri + 'integrations/' + intkey,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
        
    }
    //does not work
    async getAssistants(apikey,assetkey = ''){
        
        return axios({
            url: 'https://integrator.io/api/ui/assistants',
            method: 'get'
            //headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
        
    }

    async getUsers(apikey,intkey=''){
        var uri = 'ashares/';
        
        return axios({
            url: baseUri + uri,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getFlows(apikey,intkey=''){
        var uri = 'flows/';
        if (intkey) uri = 'integrations/' + intkey + "/flows";
        return axios({
            url: baseUri + uri,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getFlowByName(apikey,name){
                
        return axios({
            url: baseUri + 'flows/',
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data.filter(obj => obj.name === name);
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getFlow(apikey,flowid){
        return axios({
            url: baseUri + 'flows/' + flowid,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getExports(apikey,exportid=''){
        return axios({
            url: baseUri + 'exports/' + exportid,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getExportByName(apikey,name){
        return axios({
            url: baseUri + 'exports/',
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data.filter(obj => obj.name === name);
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getConnectionByName(apikey,name){
        return axios({
            url: baseUri + 'connections/',
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data.filter(obj => obj.name === name);
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getImports(apikey,importid=''){
        return axios({
            url: baseUri + 'imports/' + importid,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getConnections(apikey,connid=''){
        return axios({
            url: baseUri + 'connections/' + connid,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getIntegrationFlows(apikey,intkey){

        return axios({
            url: baseUri + 'integrations/' + intkey + "/flows",
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async getScripts(apikey,scriptkey=''){

        return axios({
            url: baseUri + 'scripts/' + scriptkey,
            method: 'get',
            headers: {'Authorization': 'Bearer ' + apikey}
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async createIntegration(apikey, intName){

        return axios({
            url: baseUri + 'integrations/' ,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + apikey,
                'Content-Type': 'application/json'
            },
            data:{
                name: intName
            }
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async createFlow(apikey, flowDef){
        var flowObj;
        if (flowDef instanceof Object)
            flowObj = flowDef;
        else 
            flowObj = JSON.parse(flowDef);
        return axios({
            url: baseUri + 'flows' ,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + apikey,
                'Content-Type': 'application/json'
            },
            data: flowObj
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async createImport(apikey, importDef){
        var importObj;
        if (importDef instanceof Object)
            importObj = importDef;
        else 
            importObj = JSON.parse(importDef); 
        return axios({
            url: baseUri + 'imports' ,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + apikey,
                'Content-Type': 'application/json'
            },
            data: importObj
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async createConnection(apikey, connDef){
        var connObj = JSON.parse(connDef);
        return axios({
            url: baseUri + 'connections' ,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + apikey,
                'Content-Type': 'application/json'
            },
            data: connObj
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }

    async createExport(apikey, exportDef){
        var exportObj;
        if (exportDef instanceof Object)
            exportObj = exportDef;
        else 
            exportObj = JSON.parse(exportDef); 
        return axios({
            url: baseUri + 'exports' ,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + apikey,
                'Content-Type': 'application/json'
            },
            data: exportObj
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            console.log(err.data);
            throw err;
        });
    }

    async createScript(apikey, scriptDef){
        var scriptObj = JSON.parse(scriptDef);
        return axios({
            url: baseUri + 'scripts' ,
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + apikey,
                'Content-Type': 'application/json'
            },
            data: scriptObj
        })
        .then(res => {

            return res.data;
        })
        .catch(err => {
            console.log('in error');
            //console.log(err);
            throw err;
        });
    }
}

module.exports.IntegratorApi = IntegratorApi;