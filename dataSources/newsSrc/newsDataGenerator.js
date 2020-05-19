const NewsDataFetcher = require('./newsDataFetcher.js');
const rsssCreate = require('./RSSS/rsss.js').rsssCreate;
const crypto = require('crypto');

class NewsDataGenerator{
    async gen(conf){
        let queries = this.genQueries(conf);
        let f = new NewsDataFetcher();
        let articleBuffers = await f.fetchSimple(queries);

        let [key, shares_b64] = rsssCreate(conf.rsss.sharesNum, conf.rsss.threshold, articleBuffers);
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