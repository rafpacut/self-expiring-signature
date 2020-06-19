const readConfig = require('../configReader.js').readConfig;
const rsssCombine = require('./RSSS/rsss').rsssCombine;
const hashData = require('../../utils').hashData;
const tiny = require('tiny-json-http');

//fetch function names are worse than terrible...
class NewsDataFetcher{
    constructor(){
        const config = readConfig('gnews');
        this.newsEndPoint = 'https://gnews.io/api/v3/search?token='+config.key;
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
        for(const query of queries){
            let result;
            try{
                let queryEndpoint = this.newsEndPoint+'&q='+query;
                result = await tiny.get({'url':queryEndpoint})
            }catch(e){
                throw new Error(`While fetching news data: ${e}`);
            }
            if(result.body.articleCount > 0){
                let articleTitles = result.body.articles.map((art)=> art.title);
                data.push(articleTitles);
            }
            else{
                data.push(0);
            }
        }
        let hashedData = data.map((d)=>hashData(d).slice(32));
        return {'parts':hashedData};
    }
}
module.exports = NewsDataFetcher;
