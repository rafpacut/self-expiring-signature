const fs = require('fs')
const mcl = require('mcl-wasm')

function isDate(input){
    return new Date(input) != 'Invalid Date'
}

function isMode(arg){
    if(arg == "dns" || arg == "service" || arg == "news"){
        return true;
    }
    return false;
}

function processCmdArgs(){
    let argv = process.argv
    if(argv.length < 3){
        throw 'No message and no mode provided'
    }

    let mode, msg;
    if(isMode(argv[2])){
        mode = argv[2];
        msg = argv[3];
    }
    else if(isMode(argv[3])){
        msg = argv[2];
        mode = argv[3];
    }
    else{
        throw "Provide a message and a mode";
    }
    return [msg, mode]
}

function readSignature(){
    let rawData = readFromFile()
    let s = new mcl.Fr()
    let X = new mcl.G1()
    let signerPublicKey = new mcl.G1()

    s.setStr(rawData.signature.s, 10)
    X.setStr(rawData.signature.X, 10)
    signerPublicKey.setStr(rawData.signerPublicKey, 10)

    return {
            "signature": [s, X],
            "mode": rawData.mode,
            "signerPublicKey": signerPublicKey,
            "msg": rawData.msg,
            "portrayal" : rawData.portrayal
    }
}

function readFromFile(){
    let argv = process.argv
    if(argv.length < 3){
        throw "Provide signature file path"
    }
    try{
        fs.accessSync(argv[2], fs.F_OK | fs.R_OK)
        let dataRaw = fs.readFileSync(argv[2])
        return JSON.parse(dataRaw)
    }catch(err){
        throw `while reading signature from ${argv[2]}: ${err}`
    }
}

function createSignatureJSON(sign, mode, msg){
    let [signature, signerPublicKey, portrayal] = sign;
    let [s, X] = signature;
    let signatureJson = JSON.stringify({
                                    "signature": {
                                        "s" : s.getStr(),
                                        "X": X.getStr()
                                    },
                                    "mode": mode,
                                    "signerPublicKey": signerPublicKey.getStr(),
                                    "msg" : msg,
                                    "portrayal" : portrayal
                                });
    return signatureJson;
}

function saveSignatureToFile(sign, mode, msg, filePath="default"){
    let signatureJson = createSignatureJSON(sign, mode, msg);
    if(filePath != "default"){
        fs.access(filePath, (err) => {//if file does not exist
           fs.writeFileSync(filePath, signatureJson, (err) =>{
                throw `While saving signature to ${filePath} : ${err}`
           }) 
        })
        return true;
    }

    let signaturesDir = './signatures/'
    let signatureFilesNum = fs.readdirSync(signaturesDir).length
    let date = new Date().toISOString().slice(0,10);

    for(i = 0; i < signatureFilesNum+1; i++){
        let signatureFilePath = `./signatures/${date}_${i}.ephSign`
        try{
            fs.accessSync(signatureFilePath)//throws if path does not exist
        } catch(err){//if path does not exist, write to it.
            fs.writeFileSync(signatureFilePath, signatureJson, (err)=>{
                throw `While saving signature to ${signatureFilePath} : ${err}`
            })
            console.log(`Saved the signature to ${signatureFilePath}`)
            return true
        }
    }
    return false
}

module.exports.processCmdArgs = processCmdArgs
module.exports.saveSignatureToFile = saveSignatureToFile
module.exports.readSignature = readSignature 
