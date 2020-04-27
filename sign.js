const ExpiringSignature = require('./expSigner.js')
const utils = require('./utils.js')
const mcl = require('mcl-wasm')

mcl.init(mcl.BLS12_381).then(()=>{

let [msg, mode] = utils.processCmdArgs();

(async () => {
    es = new ExpiringSignature(mode);
    let sign = await es.sign(msg);
    utils.saveSignatureToFile(sign, mode, msg);
    if(mode=="dns"){
        es.keepAlive();
    }
})();//end of async signature creation
});//end of mcl promise