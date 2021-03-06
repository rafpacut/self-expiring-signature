const crypto = require("crypto")

class ConfigGenerator{
    genConfig(mode){

       switch(mode){
            case "dns":
                return this.genDNSConfig();
            case "service":
                return this.genServiceConfig();
            case "news":
                return this.genNewsConfig();
       }
    }

    genDNSConfig(){
        return {
           'dnsPortrayalSize' : 2,
           'subDomainNameLength' : 4,
           'dataByteLength': 1
       };
    }

    genServiceConfig(){
       //sample config -- actually I want to forward user's expiration date and handle that in dataGenerator
       let randomSignatureId = crypto.randomBytes(32).readUInt32BE();
       return randomSignatureId;
    }

    genNewsConfig(){
            return {'queryNum':10,
                        rsss : {
                            'sharesNum': 4,
                            'threshold':2
                        }
            };
    }
}
module.exports = ConfigGenerator;