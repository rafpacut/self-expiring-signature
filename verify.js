const ExpiringSignature = require('./expSigner.js')
const utils = require('./utils.js')
const mcl = require('mcl-wasm')

mcl.init(mcl.BLS12_381).then(()=>{
(async ()=> {
    let sign = utils.readSignature()
    let es = new ExpiringSignature(sign.mode)
    es.verify(sign.msg, sign.signature, sign.signerPublicKey, sign.portrayal)
})();
});