const DNSCacheInserter = require('./dnsCacheInserter.js');
const DNSCacheFetcher = require('./dnsCacheFetcher.js');
const crypto = require('crypto');

function createBitArray(data)
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

let dnsPortrayalSize = 1;
let subDomainNameLength = 4;
let dataLength = 1;
let x = new DNSCacheInserter(dnsPortrayalSize, subDomainNameLength);

let randData = crypto.randomBytes(dataLength);
let bitArray = createBitArray(randData);

(async () => {
    let portrayal = await x.insertData(bitArray);
    let y = new DNSCacheFetcher();
    let reconstructedData = await y.fetch(portrayal);
    for(let i = 0; i < bitArray.length; i++){
        if(bitArray[i] != reconstructedData[i]){
            throw `reconstructed data differs on index ${i} -- got ${reconstructedData[i]} instead of ${bitArray[i]}`;
        }
    }
    console.log("Succesfully reconstructed the data");
})();