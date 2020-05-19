const mcl = require('mcl-wasm');

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
module.exports = Polynomial;