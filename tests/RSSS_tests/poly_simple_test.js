var expect = require('chai').expect;
const mcl = require('mcl-wasm');
const RSSS = require('../../dataSources/newsSrc/rsss.js');
const Poly = RSSS.Polynomial;

describe('polynomial', function(){
    it('rises to power correctly', function(done){
       mcl.init(mcl.BLS12_381).then(function(){
        let base = new mcl.Fr(); let e = 3;
        base.setInt(5);
        let P = new Poly(12, 2);

        let expected = new mcl.Fr();
        expected.setInt(125);
        let actual = new mcl.Fr();
        actual = P.slowPower(base, e);
        expect(actual.isEqual(expected)).to.be.true;
        done();
       });
    });

    it('is properly constructed', function(done){
        //2+2*x+1*x^2
        let P = new Poly(2, 3, [2, 1]);
        expect(P.coeffs).to.deep.equal([2, 2, 1]);
        done();
    });

    describe('computes value properly', function(){
        it('at 0', function(done){
            mcl.init(mcl.BLS12_381).then(function(){
                let a0 = new mcl.Fr();
                a0.setInt(7);
                let a1 = new mcl.Fr(); let a2 = new mcl.Fr();
                a1.setInt(2); a2.setInt(3);

                let P = new Poly(a0, 2, [a1, a2]);

                let zero = new mcl.Fr(); zero.setInt(0);
                let actual = P.valueAt(zero);
                let expected = a0;
                expect(expected.isEqual(actual)).to.be.true;
                done();
            });
        });

        it('at other point', function(done){
            mcl.init(mcl.BLS12_381).then(function(){
                let a0 = new mcl.Fr(); a0.setInt(7);
                let a1 = new mcl.Fr(); let a2 = new mcl.Fr();
                a1.setInt(2); a2.setInt(3);

                let P = new Poly(a0, 2, [a1, a2]);
                let three = new mcl.Fr(); three.setInt(3);
                let actual = P.valueAt(three);
                let expected = new mcl.Fr(); 
                expected.setInt(27+6+7);
                expect(actual.isEqual(expected)).to.be.true;
                done();
            });

        });
    });
});