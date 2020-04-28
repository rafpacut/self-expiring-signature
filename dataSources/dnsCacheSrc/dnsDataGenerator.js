const crypto = require('crypto');
const DNSCacheInserter = require('./dnsCacheInserter.js');

class DNSDataGenerator
{
    async gen(conf){
        let dci = new DNSCacheInserter(conf.dnsPortrayalSize, conf.subDomainNameLength);

        let randData = crypto.randomBytes(conf.dataByteLength);
        let bitArray = this.createBitArray(randData);

        let portrayal = await dci.insertData(bitArray);
        return [bitArray, portrayal];
    }

    createBitArray(data)
    {
        let bitArray = [];
        for(const octet of data){
            let bytes = octet.toString(2);
            for(const bit of bytes)
            {
                bitArray.push(bit);
            }
        }
        return bitArray;
    }
}
module.exports = DNSDataGenerator;