// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('CesiumWrapperService Test', function() {
    var cesiumWrapperService;

    // Setup for all tests
    beforeEach(function(){
        // Loading module must because that module used for services
        module('ngBoilerplate.Main');
        // Inject custom service implementation


        inject(function(_CesiumWrapperService_){
            cesiumWrapperService = _CesiumWrapperService_;
        });
    });


    /*
     * Check if service defined
     */
    it('should exist', function(){
        expect(cesiumWrapperService).toBeDefined();
    });
});