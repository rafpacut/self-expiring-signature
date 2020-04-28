const RedditFetcher = require('./redditFetcher.js');

class RedditDataGenerator
{
    async gen(conf){
       let fetcher = new RedditFetcher();
       let data = await fetcher.fetch(conf);
       return [data, conf]; 
    }
}

module.exports = RedditDataGenerator;