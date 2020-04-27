const RedditFetcher = require('./redditSrc/redditFetcher.js')
const DNSCacheFetcher = require('./dnsCacheSrc/dnsCacheFetcher.js');
const DNSDataGenerator = require('./dnsCacheSrc/dnsDataGenerator.js');

class EphDataSource{
    async fetchData(portrayal){
        let source = "dns";
        switch(source){
            case "reddit":
                let duration = 5; //a dummy
                let rf = new RedditFetcher(duration);
                return rf.fetchTop10()
            case "dns":
                let dcf = new DNSCacheFetcher()
                return await dcf.fetch(portrayal);
            case "test":
                return "foo"
        }
    }

    async genData(mode, conf){
        if(mode == "dns"){
            let dg = new DNSDataGenerator();
            return await dg.genData(conf);
        }
    }
}

module.exports = EphDataSource