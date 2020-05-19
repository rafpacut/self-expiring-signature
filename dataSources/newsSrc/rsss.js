const mcl = require('mcl-wasm');
const crypto = require('crypto');

class Polynomial{
    //stored as a_0+a_1*x_1+...+a_n*x_n
    constructor(freeTerm, degree, coeffs=undefined){
        if(coeffs == undefined){
            this.coeffs = [freeTerm].concat(this.genRandomCoeffs(degree));
        }
        else{
            this.coeffs = [freeTerm].concat(coeffs);
        }
        this.degree = degree;
    }

    genRandomCoeffs(degree){
        let coeffs = [];
        for(let i = 0; i < degree; i++){
            let x = new mcl.Fr();
            x.setByCSPRNG();
            coeffs.push(x);
        } 
        return coeffs;
    }

    valueAt(p){
        if(p.isZero()){
            return this.coeffs[0];
        }

        let sum = new mcl.Fr();
        sum.setInt(0);
        for(let i = 0; i <= this.degree; i++){
            sum = mcl.add(sum, mcl.mul(this.coeffs[i],this.slowPower(p, i)));
        }
        return sum;
    }

    slowPower(base,exp){
        let res = new mcl.Fr();
        res.setInt(1);
        for(let j = 0; j < exp; j++){
            res = mcl.mul(res, base);
        }
        return res;
    }

    toString(){
        let str = "Polynomial[degree="+this.degree+": ";
        for(let i = 0; i <= this.degree; i++){
            str += "x^"+i+" * "+this.coeffs[i].getStr()+" + ";
        }
        return str+']';
    }
}

function encryptShare(share, key){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const enc = Buffer.concat([cipher.update(share), cipher.final()]);
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
    return decrypted;
}

module.exports = {
    Polynomial : Polynomial,
    split : (key, keyPartsNum, threshold)=>{
        let P = new Polynomial(key, threshold-1);

        //produce keyPartsNum points
        let keyParts = [];
        for(let i = 0; i < keyPartsNum; i++){
            let x = new mcl.Fr();
            x.setByCSPRNG();
            keyParts.push({'x': x, 'y': P.valueAt(x)})
        }
        return keyParts;
    },

    merge: (keyParts)=>{
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
    },
    rsssCreate : (keyPartsNum, threshold, parts)=>{
        let key = new mcl.Fr();
        key.setByCSPRNG();
        let shares = this.split(key, keyPartsNum, threshold);
        for(let i = 0; i < keyPartsNum; i++){
            shares[i] = encryptShare(shares[i],parts[i]);
        }
        return [key, shares];
    },
    rsssCombine : (parts, shares)=>{
        for(let i = 0; i < parts.length; i++){
               shares[i] = decryptShare(shares[i], parts[i]); 
        }
        let key = this.merge(shares);
        return key;
    }

}