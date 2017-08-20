/**
 * Created by Pavel.Karas on 1/15/2017.
 */
describe('GeographicConverterService Test', function () {
    var geographicConverterService;
    var actual;
    var expected;


    beforeEach(function () {
        module('ngBoilerplate.Main');


        inject(function (_GeographicConverterService_) {
            geographicConverterService = _GeographicConverterService_;
            geographicConverterService.settings = initSettings;
        });
    });

    /*
     * Check if injection success
     */

    it('should GeographicConverterService exist', function () {
        expect(geographicConverterService).toBeDefined();
    });


    /*
     * Testing convertDecimalDegToDegMinSec
     */
    it('should convertDecimalDegToDegMinSec on 0 return "{degrees: 0, minutes: 0, seconds: 0}"', function (){
        actual = 0;
        expected = {
            degrees: 0,
            minutes: 0,
            seconds: 0
        };
        expect(geographicConverterService.convertDecimalDegToDegMinSec(actual)).toEqual(expected);
    });

    it('should convertDecimalDegToDegMinSec on 0 return "{degrees: 0, minutes: 0, seconds: 0}"', function (){
        actual = 360.5;
        expected = {
            degrees: 360,
            minutes: 30,
            seconds: 0
        };
        expect(geographicConverterService.convertDecimalDegToDegMinSec(actual)).toEqual(expected);
    });

    it('should convertDecimalDegToDegMinSec on 18.213 return "{degrees: 18, minutes: 12, seconds: 46.80000000000348}"', function (){
        actual = 18.213;
        expected = {
            degrees: 18,
            minutes: 12,
            seconds: 46.80000000000348
        };
        expect(geographicConverterService.convertDecimalDegToDegMinSec(actual)).toEqual(expected);
    });

    // TODO: Check this case with http://www.rapidtables.com/convert/number/degrees-to-degrees-minutes-seconds.htm
    it('should convertDecimalDegToDegMinSec on -18.213 return "{degrees: -18, minutes: 12, seconds: 46.80000000000348}"', function (){
        actual = -18.213;
        expected = {
            degrees: -18,
            minutes: 12,
            seconds: 46.80000000000348
        };
        expect(geographicConverterService.convertDecimalDegToDegMinSec(actual)).toEqual(expected);
    });


    /*
     * Testing convertDegMinSecToDecimalDegTo
     */
    it('should convertDecimalDegToDegMinSec on 0 return "{degrees: 0, minutes: 0, seconds: 0}"', function (){
        expected = 0;
        actual = {
            degrees: 0,
            minutes: 0,
            seconds: 0
        };
        expect(geographicConverterService.convertDegMinSecToDecimalDegTo(actual)).toEqual(expected);
    });

    it('should convertDegMinSecToDecimalDegTo on {degrees: 18, minutes: 12, seconds: 46.80000000000348} return 18.213', function(){
        actual = {
            degrees: 18,
            minutes: 12,
            seconds: 46.80000000000348
        };
        expected = 18.213;
        expect(geographicConverterService.convertDegMinSecToDecimalDegTo(actual)).toEqual(expected);
    });

    // TODO: Check this case with http://www.rapidtables.com/convert/number/degrees-to-degrees-minutes-seconds.htm
    it('should convertDegMinSecToDecimalDegTo on {degrees: -18, minutes: 12, seconds: 46.80000000000348} return -18.213', function(){
        actual = {
            degrees: -18,
            minutes: 12,
            seconds: 46.80000000000348
        };
        expected = -18.213;
        expect(geographicConverterService.convertDegMinSecToDecimalDegTo(actual)).toEqual(expected);
    });


    /*
     * Testing convertDecimalDegLatLongToUTM
     */
    it('should convertDecimalDegLatLongToUTM on {latitude: 45, longitude: 45, datumName: "WGS84"} return {x:500000, y:4982950.4, zone:38, southHemisphere: false}', function(){
        actual = {
            lat: 45,
            lon: 45,
            datum: 'WGS84'
        };
        expected = {
            x: 500000,
            y: 4982950.4,
            zone: 38,
            southHemisphere: false
        };
        expect(geographicConverterService.convertDecimalDegLatLongToUTM(actual.lat, actual.lon, actual.datum)).toEqual(expected);
    });

    it('should convertDecimalDegLatLongToUTM on {latitude: -45, longitude: -45, datumName: "WGS84"} return {x:500000, y:5017049.6, zone:23, southHemisphere: true}', function(){
        actual = {
            lat: -45,
            lon: -45,
            datum: 'WGS84'
        };
        expected = {
            x: 500000,
            y: 5017049.6,
            zone: 23,
            southHemisphere: true
        };
        expect(geographicConverterService.convertDecimalDegLatLongToUTM(actual.lat, actual.lon, actual.datum)).toEqual(expected);
    });


    /*
     * Testing convertUTMToDecimalDeg
     */
    it('should convertUTMToDecimalDeg on {x:500000, y:4982950.4, zone:38, southHemisphere: true, datum: "WGS84"} return {latitude: 44.999999997933244, longitude: 45}', function(){
        actual = {
            x: 500000,
            y: 4982950.4,
            zone: 38,
            southHemisphere: false,
            datum: 'WGS84'
        };
        expected = {
            latitude: 44.999999997933244,
            longitude: 45
        };
        expect(geographicConverterService.convertUTMToDecimalDeg(actual.x, actual.y, actual.zone, actual.southHemisphere, actual.datum)).toEqual(expected);
    });

    it('should convertUTMToDecimalDeg on {x:500000, y:5017049.6, zone:23, southHemisphere: true, datum: "WGS84"} return {latitude: -45.30695022671, longitude: -45}', function(){
        actual = {
            x: 500000,
            y: 5017049.6,
            zone: 23,
            southHemisphere: true,
            datum: 'WGS84'
        };
        expected = {
            latitude: -45.30695022671,
            longitude: -45
        };
        expect(geographicConverterService.convertUTMToDecimalDeg(actual.x, actual.y, actual.zone, actual.southHemisphere, actual.datum)).toEqual(expected);
    });


    /*
     * Testing convertGeoFromDatumToDatum
     */
    it('should convertGeoFromDatumToDatum on {latDeg:0, lonDeg:0, fromDatumName:"WGS84", toDatumName: "ED50"} return {latitude: 0.001085259838419801, longitude: 0.0008623710448569377}', function(){
        actual = {
            latDeg: 0,
            lonDeg: 0,
            fromDatumName: 'WGS84',
            toDatumName: 'ED50',
        };
        expected = {
            latitude: 0.001085259838419801,
            longitude: 0.0008623710448569377,

        };
        expect(geographicConverterService.convertGeoFromDatumToDatum(actual.latDeg, actual.lonDeg, actual.fromDatumName, actual.toDatumName)).toEqual(expected);
    });


    it('should convertGeoFromDatumToDatum on {latDeg:45, lonDeg:45, fromDatumName:"WGS84", toDatumName: "ED50"} return {latitude: 45.00076682110597, longitude: 45.0000896785061}', function(){
        actual = {
            latDeg: 45,
            lonDeg: 45,
            fromDatumName: 'WGS84',
            toDatumName: 'ED50',
        };
        expected = {
            latitude: 45.00076682110597,
            longitude: 45.0000896785061,

        };
        expect(geographicConverterService.convertGeoFromDatumToDatum(actual.latDeg, actual.lonDeg, actual.fromDatumName, actual.toDatumName)).toEqual(expected);
    });

    it('should convertGeoFromDatumToDatum on {latDeg:-45, lonDeg:-45, fromDatumName:"WGS84", toDatumName: "ED50"} return {latitude: -45.00010360481565, longitude: -44.998367802139136}', function(){
        actual = {
            latDeg: -45,
            lonDeg: -45,
            fromDatumName: 'WGS84',
            toDatumName: 'ED50',
        };
        expected = {
            latitude: -45.00010360481565,
            longitude: -44.998367802139136,

        };
        expect(geographicConverterService.convertGeoFromDatumToDatum(actual.latDeg, actual.lonDeg, actual.fromDatumName, actual.toDatumName)).toEqual(expected);
    });

    var initSettings = {
        "datums":{
            "WGS84":{
                "name":"WGS84",
                "dX":0,
                "dY":0,
                "dZ":0,
                "ellipsoid":{
                    "a": 6378137.0,
                    "f": 298.2572236,
                    "se": 0.0820944381519172

                },
                "rX":0,
                "rY":0,
                "rZ":0,
                "sf":0
            },
            "ED50":{
                "name":"ED50",
                "dX":86,
                "dY":96,
                "dZ":120,
                "ellipsoid":{
                    "a": 6378388.0,
                    "f": 296.9999999999916,
                    "se": 0.08226888960733833

                },
                "rX":0,
                "rY":0,
                "rZ":0,
                "sf":0
            }
        }
    };

});