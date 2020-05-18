const NewsAPI = require('newsapi');
const readConfig = require('../configReader.js').readConfig;

class NewsDataFetcher{
    constructor(){
        const config = readConfig('NewsDataFetcher');
        this.newsapi = new NewsAPI(config.key);
    }

    async fetch(queries){
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
        return data;
    }
}
module.exports = NewsDataFetcher;