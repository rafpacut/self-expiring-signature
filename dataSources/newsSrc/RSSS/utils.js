const crypto = require('crypto');
const mcl = require('mcl-wasm');
/*
    @key: has to be 32 bits
*/
function encryptShare(share, key){
    let shareBuffer = shareToBufferConvert(share);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update(shareBuffer), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv,tag, enc]).toString('base64');
}

function decryptShare(share, key){
    const data = Buffer.from(share, 'base64');
    const iv = data.slice(0,16);
    const tag = data.slice(16, 32);
    const enc = data.slice(32);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = decipher.update(enc, 'binary')
    let decryptedPolyPoint = shareToPoint(decrypted);
    return decryptedPolyPoint;
}

function shareToBufferConvert(share){
    return Buffer.from(share.x.getStr()+'|'+share.y.getStr());
}

function shareToPoint(dec){
    let decStr = dec.toString()
    let pointStrings = decStr.split('|');
    let x = new mcl.Fr();
    let y = new mcl.Fr();
    x.setStr(pointStrings[0]);
    y.setStr(pointStrings[1]);
    return {'x':x, 'y':y};
}

module.exports = {
                  'decryptShare' : decryptShare,
                  'encryptShare' : encryptShare
                }