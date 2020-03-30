const RedditFetcher = require('./redditSrc/redditFetcher.js')

class TimeEphemeralDataFetcher{
    fetchData(expiryDate, source){
        let duration = this.calcDuration(expiryDate)
        switch(source){
            case "reddit":
                let rf = new RedditFetcher(duration);
                return rf.fetchTop10()
            case "test":
                return "foo"
        }
    }

    calcDuration(expiryDate){
        const duration = (Date.now() - Date.parse(expiryDate))
        const dayDuration = 86400000
        const weekDuration = dayDuration*7
        const monthDuration = weekDuration*4

        if(duration < weekDuration){
            return "day"
        }
        if(duration < monthDuration){
            return "week"
        }
        return "month"
    }
}

module.exports = TimeEphemeralDataFetcher