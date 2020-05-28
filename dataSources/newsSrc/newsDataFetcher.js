const NewsAPI = require('newsapi');
const readConfig = require('../configReader.js').readConfig;
const rsssCombine = require('./RSSS/rsss').rsssCombine;
const hashData = require('../../utils').hashData;

class NewsDataFetcher{
    constructor(){
        const config = readConfig('NewsDataFetcher');
        this.newsapi = new NewsAPI(config.key);
    }

    async fetch(conf){
            let {queries, shares_b64} = conf;        
            let result = await this.fetchSimple(queries);
            let parts = result.parts;

            let data = rsssCombine(parts, shares_b64);
            return data.serialize();
    }

    async fetchSimple(queries){
        let data = [];
        let queriesUsed = [];
        for(const query of queries){
            let result;
            try{
                result = await this.newsapi.v2.topHeadlines({'q': query});
            }catch(e){
                throw new Error(`While fetching news data: ${e}`);
            }
            if(result.articles.length != 0){
                data.push(result.articles);
                queriesUsed.push(query);
            }
        }
        let hashedData = data.map((d)=>hashData(d).slice(32));
        return {'parts':hashedData, 'queriesUsed':queriesUsed};
    }
}
module.exports = NewsDataFetcher;
