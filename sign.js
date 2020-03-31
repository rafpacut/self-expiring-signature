const ExpiringSignature = require('./expSigner.js')
const utils = require('./utils.js')
const mcl = require('mcl-wasm')

mcl.init(mcl.BLS12_381).then(()=>{

let [expiryDate, msg] = utils.processCmdArgs()
es = new ExpiringSignature()
es.sign(msg, expiryDate)
.then(res =>{
    let [signature, mode, signerPublicKey] = res
    let [s, X] = signature
let signatureJson = JSON.stringify({
                                "signature": {
                                    "s" : s.getStr(),
                                    "X": X.getStr()
                                },
                                "mode": mode,
                                "signerPublicKey": signerPublicKey.getStr(),
                                "msg" : msg
                            })

utils.saveSignatureToFile(signatureJson, expiryDate)
})

})