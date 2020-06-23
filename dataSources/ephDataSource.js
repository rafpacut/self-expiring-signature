const RedditFetcher = require('./redditSrc/redditFetcher.js')
const RedditDataGenerator = require('./redditSrc/redditDataGenerator.js');
const DNSCacheFetcher = require('./dnsCacheSrc/dnsCacheFetcher.js');
const DNSDataGenerator = require('./dnsCacheSrc/dnsDataGenerator.js');
const NewsDataFetcher = require('./newsSrc/newsDataFetcher.js');
const NewsDataGenerator = require('./newsSrc/newsDataGenerator.js');
const Client = require('./serviceSrc/client.js');
const ConfigGenerator = require('./../configGenerator.js');

class EphDataSource{
    constructor(mode){
        const configGenerator = new ConfigGenerator();
        this.dataSrcConf = configGenerator.genConfig(mode);

        switch(mode){
            case "dns":
                this.dataGen = new DNSDataGenerator();
                this.fetcher = new DNSCacheFetcher();
                break;
            case "service":
                let a = new Client();
                this.dataGen = a;
                this.fetcher = a;
                break;
            case "news":
                this.dataGen = new NewsDataGenerator();
                this.fetcher = new NewsDataFetcher();
        }
    }

    fetchData(portrayal){
        return this.fetcher.fetch(portrayal);
    }

    genData(){
        return this.dataGen.gen(this.dataSrcConf);
    }
}

module.exports = EphDataSource
