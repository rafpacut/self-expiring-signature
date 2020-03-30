const snoowrap = require('snoowrap')
const fs = require('fs')

class RedditFetcher{
    constructor(duration){
        this.params = this.fitParametersToDuration(duration)

        const credentialsPath = "./redditAuthCredentials.json"
        const credentials = this.readCredentials(credentialsPath)
        this.r = new snoowrap(credentials)
    }

    readCredentials(path){
        let rawData = fs.readFileSync(path)
        return JSON.parse(rawData)
    }

    fetchTop10(){
        let subRedditOptions = {time: this.params.tFilter, limit : 10}
        return this.r.getTop( this.params.subRedditName, subRedditOptions)
    }

    fitParametersToDuration(duration){
        return {
            "subRedditName": "AskReddit",
            "tFilter": duration
        }
    }
}

module.exports = RedditFetcher