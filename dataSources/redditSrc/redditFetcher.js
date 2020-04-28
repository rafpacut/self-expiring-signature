const snoowrap = require('snoowrap')
const fs = require('fs')

class RedditFetcher{
    constructor(){
        const credentialsPath = "./redditAuthCredentials.json"
        const credentials = this.readCredentials(credentialsPath)
        this.r = new snoowrap(credentials)
    }

    readCredentials(path){
        let rawData = fs.readFileSync(path)
        return JSON.parse(rawData)
    }

    async fetch(conf){
        let tFilter = conf.tFilters[0];
        let subredditName = conf.subreddits[0];
        return await this.fetchTop10(subredditName, tFilter);
    }

    async fetchTop10(subRedditName, tFilter){
        let res = await this.r.getTop( subRedditName, {time : tFilter, limit: 10});
        let titles = [];
        for(const submission of res){
            titles.push(submission.title);
        }
        return titles;
    }
}

module.exports = RedditFetcher