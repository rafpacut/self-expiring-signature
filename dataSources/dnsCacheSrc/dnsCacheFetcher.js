const dig = require('node-dig-dns');

class DNSCacheFetcher
{
    headerIncludes(header, string){
        for(const line in header){
            if(line.includes(string)){
                return true;
            }
        }
        return false
    }

    wasCacheHit(res){
        return res.header[4][0].includes("NXDOMAIN");
    }
    wasCacheMiss(res){
        return res.header[4][0].includes("NOERROR");
    }

    async fetch(portrayal)
    {
        let recoveredData = [];
        for(const port of portrayal){
            let domainName = port.domainName;
            let servers = port.servers;

            let bitRetrievals = [];
            for(const srv of servers){
                let res = await dig(['@'+srv, '+norecurse', domainName])
                if(this.wasCacheHit(res)){
                    bitRetrievals.push(1);
                } 
                else if(this.wasCacheMiss(res)){
                    bitRetrievals.push(0);
                }
                else{
                    throw `When fetching DNS cache data: unexpected response: ${res}`;
                }
            }
            recoveredData.push(this.recover(bitRetrievals));
        }
        return recoveredData;
    }

    recover(arr){
        let threshold = arr.length/2;
        if(arr.reduce((acc, val) => acc+val) > threshold){
            return 1;
        }
        return 0;
    }
}
module.exports = DNSCacheFetcher;