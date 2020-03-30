const ExpiringSignature = require('./expSigner.js')
const utils = require('./utils.js')
const mcl = require('mcl-wasm')

mcl.init(mcl.BLS12_381).then(()=>{

let [expiryDate, msg] = utils.processCmdArgs()
es = new ExpiringSignature(expiryDate)
es.sign(msg)
.then(res =>{
let [signature, mode, signerPublicKey] = res
let signatureJson = JSON.stringify({
                                "signature": signature,
                                "mode": mode,
                                "signerPublicKey": signerPublicKey})

utils.saveSignatureToFile(signatureJson, expiryDate)
})

})