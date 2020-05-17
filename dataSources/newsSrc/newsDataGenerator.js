const NewsDataFetcher = require('./newsDataFetcher.js');
//const reverseShamirSecretSharing = require('./rsss.js');
const crypto = require('crypto');

//generate a list of random numbers.
class NewsDataGenerator{
    async gen(conf){
        let queries = this.genQueries(conf);
        let f = new NewsDataFetcher();
        let key = await f.fetch(queries);
        //let [keyParts, portrayal] = await f.fetch(queries);
        //let key = reverseShamirSecretSharing.merge(keyParts, conf);
        return [key, queries];
    }

    genQueries(conf){
        let qs = [];
        for(let i = 0; i < conf.queryNum; i++){
            let randBytes = crypto.randomBytes(conf.queryByteSize);
            qs.push(randBytes.readUInt8());
        }
        return qs;
    }
}
module.exports = NewsDataGenerator;