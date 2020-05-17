const NewsAPI = require('newsapi');
const configReader = require('../configReader.js');

class NewsDataFetcher{
    constructor(){
        const config = configReader.readConfig('NewsDataFetcher');
        this.newsapi = new NewsAPI(config);
    }

    async fetch(queries){
        let data = [];
        let portrayal = queries;
        for(const query of queries){
            let result;
            console.log(query);
            try{//possible speedup -- don't wait for all awaits sequentially
                result = await this.newsapi.v2.topHeadlines({'q': query});
            }catch(e){
                throw new Error(`While fetching news data: ${e}`);
            }
            data.push(result.articles);
        }
        return [data, portrayal];
    }
}
module.exports = NewsDataFetcher;