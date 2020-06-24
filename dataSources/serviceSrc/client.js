const axios = require('axios');
const readConfig = require('../configReader.js').readConfig;

class Client{
    constructor(){
        this.conf = readConfig('Service');
        this.hostname = this.conf['hostname'];
        this.port = this.conf['port'];
    }

    async fetch(){
        let response;
        try{
           response = await axios.get(`http://${this.hostname}:${this.port}/getData`);
        }catch(e){
            console.error(e);
            throw e;
        }
        return response.data;
    }

    async gen(){
        let data = await this.fetch();
        return [data, null];
    }
}
module.exports = Client;