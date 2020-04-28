const ShnorrSigner = require('./signatureSchemes/shnorr/Signer.js')
const ShnorrVerifier = require('./signatureSchemes/shnorr/Verifier.js')
const EphDataSource = require('./dataSources/ephDataSource.js')
const DNSRefresher = require('./dataSources/dnsCacheSrc/dnsCacheRefresher.js')
const crypto = require("crypto")

class ExpiringSignature
{
   constructor(mode){
       this.ephDataSource = new EphDataSource(mode);
       this.mode = mode;
       this.dnsRefresher = new DNSRefresher();

       const dnsSignConfig = {
           'dnsPortrayalSize' : 2,
           'subDomainNameLength' : 4,
           'dataByteLength': 1
       }
       //sample config -- actually I want to forward user's expiration date and handle that in dataGenerator
       const redditSignConfig = {
           'subreddits' : ["askreddit"],
           'tFilters'   : ["week"]
       }
       if(mode == "dns"){
           this.dataSrcConf = dnsSignConfig;
       }
       else{
           this.dataSrcConf = redditSignConfig;
       }
   }

   async sign(msg){
       let signer = new ShnorrSigner();
       let [ephData, portrayal] = await this.ephDataSource.genData(this.dataSrcConf);
       if(this.mode == "dns"){
           this.dnsRefresher.storeRefreshData(ephData, portrayal);
       }
       let ephHash = this.hashData(ephData)
       let signature = signer.sign(msg, ephHash)
       return [signature, signer.publicKey, portrayal]
   }

   keepAlive(){
        this.dnsRefresher.keepAlive();
   }

   async verify(msg, signature, signerPubKey, portrayal){
       let [s, X] = signature
       let verifier = new ShnorrVerifier(signerPubKey)
       let ephData = await this.ephDataSource.fetchData(portrayal)
       let ephHash = this.hashData(ephData)
       console.log(verifier.verify(msg, s, X, ephHash))
   }

    hashData(data){
        const hash = crypto.createHash('SHA3-512')
        hash.update(Buffer.from(data))
        return hash.digest()
    }
}
module.exports = ExpiringSignature