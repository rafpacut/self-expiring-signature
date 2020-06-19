const NewsDataFetcher = require('./newsDataFetcher.js');
const rsssCreate = require('./RSSS/rsss.js').rsssCreate;
const cryptoRandomInt = require('crypto-random-int');

class NewsDataGenerator{

    async getParts(conf){
        let f = new NewsDataFetcher();
        let queries;
        let parts;

        queries = await this.genQueries(conf);
        ({parts} = await f.fetchSimple(queries));
        if(parts.length < conf.rsss.threshold){
            throw new Error("when generating news data: parts.length < rsss.threshold");
        }

        return {'parts':parts, 'queries':queries};
    } 

    async gen(conf){
        let {parts,queries} = await this.getParts(conf);

        let [key, shares_b64] = rsssCreate(conf.rsss.sharesNum, conf.rsss.threshold, parts);
        let data = key.serialize();
        let portrayal = {'shares_b64': shares_b64, 'queries':queries};
        return [data, portrayal];
    }

    async genQueries(conf){
        let qs = [];
        for(let i = 0; i < conf.queryNum; i++){
            cryptoRandomInt(3000, 9999)
            .then((randInt)=>{
                qs.push(randInt);
            })
            .catch((err)=>{
                throw err;
            })
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
