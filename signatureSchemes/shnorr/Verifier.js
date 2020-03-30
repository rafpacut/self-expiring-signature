const mcl = require("mcl-wasm");
const hash = require("./sssUtil.js");

class Verifier
{
    constructor(A)
    {
        this.A = A;
        this.g = new mcl.G1();
        this.g.setStr("1 3685416753713387016781088315183077757961620795782546409894578378688607592378376318836054947676345821548104185464507 1339506544944476473020471379941921221584933875938349620426543736416511423956333506472724655353366534992391756441569", 10);
    }

    verify(msg, s, X, ephData)
    {
        const h = hash.hash(`${msg}${X.getStr()}${ephData}`);
        let c = new mcl.Fr();
        c.setStr(h);

        const lhs = mcl.mul(this.g, s);

        const Ac = mcl.mul(this.A, c);
        const rhs = mcl.add(X, Ac);

        return lhs.isEqual(rhs);
    }
}

module.exports = Verifier;