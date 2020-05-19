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
            let articleBuffers = await this.fetchSimple(queries);
            let data = rsssCombine(articleBuffers, shares_b64);
            return data.serialize();
    }

    async fetchSimple(queries){
        let data = [];
        for(const query of queries){
            let result;
            try{
                result = this.newsapi.v2.topHeadlines({'q': query});
            }catch(e){
                throw new Error(`While fetching news data: ${e}`);
            }
            data.push(result.articles);
        }
        return data.map((d)=>hashData(d).slice(32));
    }
}
module.exports = NewsDataFetcher;