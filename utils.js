const fs = require('fs')

function isDate(input){
    return new Date(input) != 'Invalid Date'
}

function processCmdArgs(){
    let argv = process.argv
    if(argv.length < 1){
        throw 'No signature path and no expiry date provided'
    }

    let date, msg
    if(isDate(argv[1])){
        date = new Date(argv[1])
        msg = argv[2]
    }
    else if(isDate(argv[2])){
        msg = argv[1]
        date = new Date(argv[2])
    }
    else{
        throw "Provide a message and an expiry date"
    }
    return [date, msg]
}

function saveSignatureToFile(signatureJson, expiryDate, filePath="default"){
    if(filePath != "default"){
        fs.access(filePath, (err) => {//if file does not exist
           fs.writeFileSync(filePath, signatureJson, (err) =>{
                throw `While saving signature to ${filePath} : ${err}`
           }) 
        })
    }

    let signaturesDir = './signatures/'
    let signatureFilesNum = fs.readdirSync(signaturesDir).length
    let expiryDateString = expiryDate.toISOString().slice(0,10)

    for(i = 0; i < signatureFilesNum+1; i++){
        let signatureFilePath = `./signatures/${expiryDateString}_${i}.ephSign`
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