const mcl = require('mcl-wasm');
const encryptShare = require('./utils.js').encryptShare;
const decryptShare = require('./utils.js').decryptShare;
const Polynomial = require('./poly');

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

function rsssCreate(keyPartsNum, threshold, parts){
    let key = new mcl.Fr();
    key.setByCSPRNG();
    let shares = split(key, keyPartsNum, threshold);
    for(let i = 0; i < keyPartsNum; i++){
        shares[i] = encryptShare(shares[i],parts[i]);
    }
    return [key, shares];
}

function rsssCombine(parts, shares){
    if(parts.length != shares.length){
        throw new Error(`While reconstructing Reverse Shamir Secret Sharing key: parts.length != shares.length`);
    }
    for(let i = 0; i < parts.length; i++){
            shares[i] = decryptShare(shares[i], parts[i]); 
    }
    let key = merge(shares);
    return key;
}

module.exports = {
    rsssCombine : rsssCombine,
    rsssCreate : rsssCreate,
    split: split,
    merge : merge
}