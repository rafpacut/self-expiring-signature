const dig = require('node-dig-dns');
const crypto = require('crypto');
const fs = require('fs');


class DNSCacheInserter 
{
    constructor(dnsPortrayalSize, subDomainNameLength)
    {
        this.dnsPortrayalSize = dnsPortrayalSize;
        this.subDomainNameLength = subDomainNameLength;

        const serverListPath = "./dataSources/dnsCacheSrc/serverList.json";
        let rawData = fs.readFileSync(serverListPath);
        this.dnsServers = JSON.parse(rawData);
    }

    async insertData(bitArray){
        let dnsPortrayal = [];

        for(const bit of bitArray){
            let nonExistingSubDomain = crypto.randomBytes(this.subDomainNameLength).toString('hex');
            let servers = this.dnsServers.slice(0,this.dnsPortrayalSize);//randomize in future
            dnsPortrayal.push(
                    {
                        'domainName' : nonExistingSubDomain + '.example.com',
                        'servers' : servers
                    }
            );
            if(bit == '1')
            {
                for(const srv of servers){
                    dig(['@'+srv, nonExistingSubDomain+'.example.com']);
                };
            }
        };
        return dnsPortrayal;
    }
}

module.exports = DNSCacheInserter;