var expect = require('chai').expect;
const EphDataSource = require('../../dataSources/ephDataSource');
const mcl = require('mcl-wasm');

describe('news data source', function(){
    it('generates and reconstructs key with rsss', function(done){
        mcl.init(mcl.BLS12_381).then(function(){
            const mode = "news";
            let ephSrc = new EphDataSource(mode);

            let srcConfig = {'queryByteSize':5, 'queryNum':5,
                            rsss : {
                                'sharesNum': 4,
                                'threshold':2
                            }
            };

            (async ()=>{
                let [dataExpected, portrayal] = await ephSrc.genData(srcConfig);

                let dataActual = await ephSrc.fetchData(portrayal);

                //cast to Fr to apply checks. Apparently UInt8Array has to be checked cell-by-cell
                let expected = new mcl.Fr();
                let actual = new mcl.Fr();
                expected.deserialize(dataExpected);
                actual.deserialize(dataActual);
                expect(expected.isEqual(actual)).to.be.true;
                done();
            })();
        });
    });
});