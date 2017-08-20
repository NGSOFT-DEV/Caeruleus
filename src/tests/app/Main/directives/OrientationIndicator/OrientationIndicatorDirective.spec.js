/**
 * Created by Pavel.Karas on 1/17/2017.
 */
describe('OrientationIndicatorDirective Test', function () {
    var cesiumWrapperService, scope, sortButtonController, httpBackend;

    beforeEach(function () {
        module('ngMockE2E');
        module('ngBoilerplate.Main');
        module('templates-app');

        inject(function ($httpBackend) {
            httpBackend = $httpBackend;
            httpBackend.when('GET', function (url) {
                return url.indexOf('.json') != -1;
            }).passThrough();
        });
    });
    beforeEach(function () {


        inject(function (_CesiumWrapperService_, $rootScope, $compile) {
            cesiumWrapperService = _CesiumWrapperService_;
            scope = $rootScope.$new();
            var element = angular.element('<orientation-indicator></orientation-indicator>');
            element = $compile(element)(scope);
            scope.$digest();
            sortButtonController = element.controller('orientationIndicator');
        });
    });

    /*
     * Check if injection success
     */

    it('should CesiumWrapperService exist', function () {
        expect(cesiumWrapperService).toBeDefined();
    });

    it('should SortButtonController exist', function () {
        expect(sortButtonController).toBeDefined();
    });



});