const dig = require('node-dig-dns');

class DNSCacheRefresher
{
    constructor(){
        this.refreshPortrayal = [];
    }

    storeRefreshData(bitArray, portrayal){
        for(let i = 0; i < bitArray.length; i++){
            if(bitArray[i] == "1"){
                this.refreshPortrayal.push(portrayal[i]);
            }
        }
    }

    async refresh(srv, domainName){
        dig(['@'+srv, domainName]);
    }

    async keepAlive(){
        for(const p of this.refreshPortrayal){
            for(const srv of p.servers){
                const res = await dig(['@'+srv, p.domainName]);
                const ttl = res.authority[0][1]*60;
                setInterval(()=>{
                    this.refresh(srv, p.domainName);
                }, ttl);
            }
        }
    }
}
module.exports = DNSCacheRefresher;