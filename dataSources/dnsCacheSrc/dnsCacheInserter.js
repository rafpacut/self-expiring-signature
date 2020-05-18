const dig = require('node-dig-dns');
const crypto = require('crypto');
const readConfig = require('../configReader.js').readConfig;


class DNSCacheInserter 
{
    constructor(dnsPortrayalSize, subDomainNameLength)
    {
        this.dnsPortrayalSize = dnsPortrayalSize;
        this.subDomainNameLength = subDomainNameLength;

        this.dnsServers = readConfig('DNSCache');
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