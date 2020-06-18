const ShnorrSigner = require('./signatureSchemes/shnorr/Signer.js')
const ShnorrVerifier = require('./signatureSchemes/shnorr/Verifier.js')
const EphDataSource = require('./dataSources/ephDataSource.js')
const DNSRefresher = require('./dataSources/dnsCacheSrc/dnsCacheRefresher.js')
const hashData = require('./utils').hashData;

class ExpiringSignature
{
   constructor(mode){
       this.ephDataSource = new EphDataSource(mode);
       this.mode = mode;
       this.dnsRefresher = new DNSRefresher();
   }

   async sign(msg){
       let signer = new ShnorrSigner();
       let [ephData, portrayal] = await this.ephDataSource.genData();
       if(this.mode == "dns"){
           this.dnsRefresher.storeRefreshData(ephData, portrayal);
       }
       let ephHash = hashData(ephData)
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
       let ephHash = hashData(ephData)
       console.log(verifier.verify(msg, s, X, ephHash))
   }
}
module.exports = ExpiringSignature
