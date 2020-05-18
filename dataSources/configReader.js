const fs = require('fs');


let nameToPathMap = new Map();
nameToPathMap.set('NewsDataFetcher', './conf/newsAPI.key');
nameToPathMap.set('DNSCache', './conf/serverList.json');
nameToPathMap.set('Service', './conf/cli.conf');

module.exports = {
readConfig : function(callerName){
    const path = nameToPathMap.get(callerName);
    let config;
    try{
        config = JSON.parse(fs.readFileSync(path));
    }catch(e){
        throw new Error(`While reading config for ${callerName}: ${e}`);
    }
    return config;
}
}