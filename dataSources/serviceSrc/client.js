const axios = require('axios');
const readConfig = require('../configReader.js').readConfig;

class Client{
    constructor(){
        this.conf = readConfig('Service');
        this.hostname = this.conf['hostname'];
        this.port = this.conf['port'];
    }

    async fetch(id){
        let response;
        try{
           response = await axios.get(`http://${this.hostname}:${this.port}/getData/${id}`);
        }catch(e){
            console.error(e);
            throw e;
        }
        if(response.status == "200"){
            return response.data[0].data;
        }
        if(response.status == "204"){
            throw `No signature with id: ${id}`;
        }
    }

    async gen(newId){
        let response;
        try{
            response = await axios.post(`http://${this.hostname}:${this.port}/setData`, {signatureID: newId});
        }catch(e){
            console.error(e);
            throw e;
        }
        if(response.status == "200"){
            return [response.data, newId];
        }
        else{
            throw new Error(`While generating data in service-mode got response: ${response.status} `);
        }
    }
}
module.exports = Client;