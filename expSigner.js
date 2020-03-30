const ShnorrSigner = require('./signatureSchemes/shnorr/Signer.js')
const ShnorrVerifier = require('./signatureSchemes/shnorr/Verifier.js')
const TimeEphemeralDataFetcher = require('./dataSources/ephDataFetcher.js')
const crypto = require("crypto")

class ExpiringSignature
{
   constructor(expiryDate){
       this.expiryDate = expiryDate 
       this.timeDataSrc = new TimeEphemeralDataFetcher()
   }

   async sign(msg){
       let mode = "test"
       let signer = new ShnorrSigner()
       let ephData = await this.timeDataSrc.fetchData(this.expiryDate, mode)
       let ephHash = this.hashData(ephData)
       let signature = signer.sign(msg, ephHash)
       return [signature, mode, signer.publicKey]
   }

   async verify(msg, signature, timeEphSrc, signerPubKey){
       let [s, X] = signature
       let verifier = new ShnorrVerifier(signerPubKey)
       let ephData = await this.timeDataSrc.fetchData(this.duration, timeEphSrc)
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