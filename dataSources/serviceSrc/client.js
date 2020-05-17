//load the ip, port config
//query, check the response, return result
//put data in
const axios = require('axios');
const fs = require('fs');

class Client{
    constructor(){
        this.conf = JSON.parse(fs.readFileSync('./dataSources/serviceSrc/cli.conf'));
        this.hostname = this.conf['hostname'];
        this.port = this.conf['port'];
    }

    async fetch(id){
        let response;
        console.log(id);
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