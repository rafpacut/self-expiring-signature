var expect = require('chai').expect;
const crypto = require('crypto');
const mcl = require('mcl-wasm');
const rsssCreate = require('../../dataSources/newsSrc/RSSS/rsss.js').rsssCreate;
const rsssCombine = require('../../dataSources/newsSrc/RSSS/rsss.js').rsssCombine;


describe('Reverse Shamir Secret Sharing',function(){
    it('reconstructs the key from parts',function(done){
        mcl.init(mcl.BLS12_381).then(function(){
            let parts = [];
            for(let i = 0; i < 5; i++){
                parts.push(crypto.randomBytes(32));
            }
            let [key, shares] = rsssCreate(3, 1, parts);
            let keyReconstructed = rsssCombine([parts[0]], [shares[0]]);
            expect(key.isEqual(keyReconstructed));
            done();
        });
    });
});