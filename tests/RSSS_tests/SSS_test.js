var expect = require('chai').expect;
const mcl = require('mcl-wasm');
const merge = require('../../dataSources/newsSrc/rsss.js').merge;
const split = require('../../dataSources/newsSrc/rsss.js').split;

describe('ShamirSecretSharing algorithm', function(){
    it('recreates the key', function(done){
        let conf = {'keyParts':6, 'threshold':3};
        mcl.init(mcl.BLS12_381).then(function(){
            let key = new mcl.Fr();
            key.setByCSPRNG();


            let shards = split(key, conf.keyParts, conf.threshold);
            //let shardsThreshold = shards.slice(2);
            //let keyReconstructed = merge(shardsThreshold);
            let shardsSelected = [shards[1], shards[3], shards[4]];
            let keyReconstructed = merge(shardsSelected);

            expect(key.isEqual(keyReconstructed)).to.be.true;
            done();
        });
    });
});