const mcl = require('mcl-wasm');
const crypto = require('crypto');
const Polynomial = require('./poly');

//----------------Shamir Secret Sharing------------------
function split(key, keyPartsNum, threshold){
    let P = new Polynomial(key, threshold-1);

    //produce keyPartsNum points
    let keyParts = [];
    for(let i = 0; i < keyPartsNum; i++){
        let x = new mcl.Fr();
        x.setByCSPRNG();
        keyParts.push({'x': x, 'y': P.valueAt(x)})
    }
    return keyParts;
}

function merge(keyParts){
    //create lagrange basis polynomials
    let ls = [];
    for(let basisPolyNum = 0; basisPolyNum < keyParts.length; basisPolyNum++){
        let l = new mcl.Fr();
        l.setInt(1);
        for(let i = 0; i < keyParts.length; i++){
            if(i!=basisPolyNum){
                let term = mcl.div(
                                //0-keyParts <==> -keyParts
                                mcl.neg(keyParts[i].x),
                                mcl.sub(keyParts[basisPolyNum].x, keyParts[i].x)
                                );
                l = mcl.mul(l, term);
            }
        }
        ls.push(l);
    }

    let key = new mcl.Fr();
    key.setInt(0);
    for(let i = 0; i < keyParts.length; i++){
        key = mcl.add(key, mcl.mul(ls[i],keyParts[i].y));
    }
    return key;
}

//---------------reverse SSSS------------------------------------

function rsssCreate(sharesNum, threshold, parts){
    if(parts.length < sharesNum){
        throw new Error("While creating RSSS shares: parts.length < sharesNum");
    }

    let key = new mcl.Fr();
    key.setByCSPRNG();
    let shares = split(key, sharesNum, threshold);
    for(let i = 0; i < sharesNum; i++){
        shares[i] = encryptShare(shares[i],parts[i]);
    }
    return [key, shares];
}

function rsssCombine(parts, shares){
    let pairsNum = Math.min(parts.length, shares.length);
    let sharesDec = [];
    for(let i = 0; i < pairsNum; i++){
            sharesDec.push(decryptShare(shares[i], parts[i])); 
    }
    let key = merge(sharesDec);
    return key;
}


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
    rsssCombine : rsssCombine,
    rsssCreate : rsssCreate,
    split: split,
    merge : merge
}