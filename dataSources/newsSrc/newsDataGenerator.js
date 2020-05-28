const NewsDataFetcher = require('./newsDataFetcher.js');
const rsssCreate = require('./RSSS/rsss.js').rsssCreate;
const crypto = require('crypto');

class NewsDataGenerator{

    async getParts(conf){
        let f = new NewsDataFetcher();
        let queries;
        let parts;
        let queriesUsed;

        while(true){
            queries = this.genQueries(conf);
            ({parts, queriesUsed} = await f.fetchSimple(queries));
            if(parts.length > conf.rsss.threshold){
               break; 
            }
        }
        return {'parts':parts, 'queries':queriesUsed};
    } 

    async gen(conf){
        let {parts,queries} = await this.getParts(conf);

        let [key, shares_b64] = rsssCreate(conf.rsss.sharesNum, conf.rsss.threshold, parts);
        let data = key.serialize();
        let portrayal = {'shares_b64': shares_b64, 'queries':queries};
        return [data, portrayal];
    }

    genQueries(conf){
        let qs = [];
        for(let i = 0; i < conf.queryNum; i++){
            let randBytes = crypto.randomBytes(conf.queryByteSize);
            qs.push(randBytes.readUInt8());
        }
        return qs;
    }


    /*
        @articles: assumes array of arrays of strings
    */
    articlesToBuffers(articles){
        return articles.map((article) => Buffer.from(article));
    }
}
module.exports = NewsDataGenerator;