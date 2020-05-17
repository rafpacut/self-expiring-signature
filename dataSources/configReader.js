const fs = require('fs');


let nameToPathMap = new Map();
nameToPathMap.set('NewsDataFetcher', './dataSources/newsSrc/newsAPI.key');

module.exports = {
readConfig : function(callerName){
    const path = nameToPathMap.get(callerName);
    let config;
    try{
        config = fs.readFileSync(path).toString().trim();
    }catch(e){
        throw new Error(`While reading config for ${callerName}: ${e}`);
    }
    return config;
}
}