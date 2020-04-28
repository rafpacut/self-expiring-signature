const RedditFetcher = require('./redditSrc/redditFetcher.js')
const RedditDataGenerator = require('./redditSrc/redditDataGenerator.js');
const DNSCacheFetcher = require('./dnsCacheSrc/dnsCacheFetcher.js');
const DNSDataGenerator = require('./dnsCacheSrc/dnsDataGenerator.js');

class EphDataSource{
    constructor(mode){
        switch(mode){
            case "reddit":
                this.dataGen = new RedditDataGenerator();
                this.fetcher = new RedditFetcher();
                break;
            case "dns":
                this.dataGen = new DNSDataGenerator();
                this.fetcher = new DNSCacheFetcher();
                break;
        }
    }

    fetchData(conf){
        return this.fetcher.fetch(conf);
    }

    genData(conf){
        return this.dataGen.gen(conf);
    }
}

module.exports = EphDataSource