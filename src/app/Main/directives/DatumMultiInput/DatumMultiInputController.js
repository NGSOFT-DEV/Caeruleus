(function (){
    'use strict';

    MainApp.controller( 'DatumMultiInputController', [ '$scope', 'GeographicConverterService',
        function($scope, GeographicConverterService){

            var that = this;

            //$scope.$parent.datumMultiInputController = $scope.datumMultiInputController;
            this.settingLoaded = false;
            

            this.pickHandler = undefined;

            this.geographicConverterService = GeographicConverterService;
            this.decimalLongitudeValue = 0;
            this.decimalLatitudeValue = 0;

            this.degMinSecLongitudeValue = { degrees: 0, minutes: 0, seconds: 0};
            this.degMinSecLatitudeValue = { degrees: 0, minutes: 0, seconds: 0};

            this.utmValue = {x: 0, y: 0, zone: 0, southHemisphere: false};

            this.selectedDatumType = "WGS84"; 
            this.previousDatumType = "WGS84";

            this.originalValueWGSLatitude = 0;
            this.originalValueWGSLongitude = 0;   

            this.datumTypes = []; 

            this.watchUpdating = false;
            this.manualUpdating = false;





            this.coordinateSystems = [
                {
                    name:"עשרוני",
                    numbering:"decimal"

                },
                {
                    name:"d°m's\"",
                    numbering:"deg-min-sec"

                },
                {
                    name:"UTM",
                    numbering:"UTM"

                }
            ];

            this.selectedCoordinateSystem = this.coordinateSystems[0].name;

            this.datumChanged = function(){

                var newDatumDecimals = GeographicConverterService.convertGeoFromDatumToDatum(that.decimalLatitudeValue, that.decimalLongitudeValue, that.previousDatumType, that.selectedDatumType);
                that.decimalLatitudeValue = newDatumDecimals.latitude;
                that.decimalLongitudeValue = newDatumDecimals.longitude;

                that.decChanged();

                that.previousDatumType = that.selectedDatumType;

            };

            this.setValue = function(lat, lng){

                if(lat && lng){
                    that.decimalLatitudeValue = that.originalValueWGSLatitude = lat;
                    that.decimalLongitudeValue = that.originalValueWGSLongitude = lng;
                }
                
                if(that.settingLoaded){
                    that.decChanged();
                }
                else{
                    Hermes.onComponentLoaded(GeographicConverterService, this.geographicConverterServiceLoaded);
                    //GeographicConverterService.registerToLoadQueue(that.decChanged);
                }
                
            };

            this.getValue = function(){

                return {latitude: that.originalValueWGSLatitude, longitude: that.originalValueWGSLongitude};
            };

            this.updateOriginalValue = function(){

                if(that.selectedDatumType === "WGS84"){
                    that.originalValueWGSLatitude = that.decimalLatitudeValue;
                    that.originalValueWGSLongitude = that.decimalLongitudeValue;
                }
                else{
                    var newDatumDecimals = GeographicConverterService.convertGeoFromDatumToDatum(that.decimalLatitudeValue, that.decimalLongitudeValue, that.selectedDatumType, "WGS84");
                    that.originalValueWGSLatitude = newDatumDecimals.latitude;
                    that.originalValueWGSLongitude = newDatumDecimals.longitude;
                }

                if(that.ngModel && !that.watchUpdating){

                    var bindParts = that.ngModel.split('.');

                    var currentValue = $scope.$parent;
                    for(var i=0;i<bindParts.length-1;i++){
                        currentValue = currentValue[bindParts[i]];
                    }

                    //if(that.releaseWatchHandle){
                     //   that.releaseWatchHandle();
                    //} 
                    currentValue[bindParts[bindParts.length-1]] = {latitude: that.originalValueWGSLatitude, longitude: that.originalValueWGSLongitude};
                    //that.watchBindable();
                }
            };

            this.decChanged = function(){

                that.manualUpdating = true;

                that.degMinSecLongitudeValue = GeographicConverterService.convertDecimalDegToDegMinSec(that.decimalLongitudeValue); 
                that.degMinSecLatitudeValue = GeographicConverterService.convertDecimalDegToDegMinSec(that.decimalLatitudeValue); 
                
                that.utmValue = GeographicConverterService.convertDecimalDegLatLongToUTM(that.decimalLatitudeValue, that.decimalLongitudeValue, that.selectedDatumType);

                //that.ed50Geo = GeographicConverterService.convertGeoFromDatumToDatum(that.decimalLatitudeValue, that.decimalLongitudeValue, that.selectedDatumType, "ED50");

                //that.UTMSome = GeographicConverterService.convertUTMToDecimalDeg(that.utmValue.x, that.utmValue.y, that.utmValue.zone, false, that.selectedDatumType);

                that.updateOriginalValue();

                that.manualUpdating = false;
            };

            this.degMinSecChanged = function(){

                that.manualUpdating = true;

                that.decimalLatitudeValue = GeographicConverterService.convertDegMinSecToDecimalDegTo(that.degMinSecLatitudeValue);
                that.decimalLongitudeValue = GeographicConverterService.convertDegMinSecToDecimalDegTo(that.degMinSecLongitudeValue);

                that.utmValue = GeographicConverterService.convertDecimalDegLatLongToUTM(that.decimalLatitudeValue, that.decimalLongitudeValue, that.selectedDatumType);

                that.updateOriginalValue();

                that.manualUpdating = false;
            };

            this.utmChanged = function(){

                that.manualUpdating = true;

                var decFromUtm = GeographicConverterService.convertUTMToDecimalDeg(that.utmValue.x, that.utmValue.y, that.utmValue.zone, that.utmValue.southHemisphere, that.selectedDatumType);
                that.decimalLatitudeValue = decFromUtm.latitude;
                that.decimalLongitudeValue = decFromUtm.longitude;

                that.degMinSecLongitudeValue = GeographicConverterService.convertDecimalDegToDegMinSec(that.decimalLongitudeValue); 
                that.degMinSecLatitudeValue = GeographicConverterService.convertDecimalDegToDegMinSec(that.decimalLatitudeValue);

                that.updateOriginalValue(); 

                that.manualUpdating = false;

                
            };

            this.geographicConverterServiceLoaded = function(){

                that.datumTypes = that.geographicConverterService.settings.datums;
                that.selectedDatumType = "WGS84";

                that.settingLoaded = true;
            };

            this.togglePickFromMap = function(){

                var viewer = Caeruleus.viewer;
                if(viewer === undefined){
                    return;
                }

                var scene = viewer.scene;
                if(scene === undefined){
                    return;
                }
                
                if(that.pickHandler){
                    that.pickHandler.destroy();
                    that.pickHandler = undefined;
                }
                else{
                    that.pickHandler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                that.pickHandler.setInputAction(function(click) {
                     var cartesian2 = click.position;
                     var ellipsoid = scene.globe.ellipsoid;
                    var cartesian3 = viewer.camera.pickEllipsoid(cartesian2, ellipsoid);
                    if (cartesian3) {
                        var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
                        that.decimalLongitudeValue = Cesium.Math.toDegrees(cartographic.longitude);
                        that.decimalLatitudeValue = Cesium.Math.toDegrees(cartographic.latitude);

                        that.decChanged();
                        $scope.$apply();

                    }

                }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
                }
                
            };

            this.watchBindable = function(){
                if(that.ngModel){

                    

                    var parentScope = $scope.$parent;

                    that.releaseWatchHandle = parentScope.$watch(that.ngModel, function(newValue, oldValue){

                        if(newValue === undefined){
                            return;
                        }
                        if(that.decimalLatitudeValue === newValue.latitude && that.decimalLongitudeValue === newValue.longitude){
                            return;
                        }
                        if(that.manualUpdating){
                            return;
                        }
                        
                        that.watchUpdating = true;
                        that.setValue(newValue.latitude, newValue.longitude);
                        that.watchUpdating = false;

                        //releaseWatchHandle();
                    });

                    that.releaseWatchHandle2 = parentScope.$watch(that.ngModel+'.latitude', function(newValue, oldValue){

                        if(newValue === undefined){
                            return;
                        }
                        if(that.decimalLatitudeValue === newValue){
                            return;
                        }
                        if(that.manualUpdating){
                            return;
                        }
                        
                        that.watchUpdating = true;
                        that.setValue(newValue, that.originalValueWGSLongitude);
                        that.watchUpdating = false;

                        //releaseWatchHandle();
                    });

                    that.releaseWatchHandle3 = parentScope.$watch(that.ngModel+'.longitude', function(newValue, oldValue){

                        if(newValue === undefined){
                            return;
                        }
                        if(that.decimalLongitudeValue === newValue){
                            return;
                        }
                        if(that.manualUpdating){
                            return;
                        }
                        
                        that.watchUpdating = true;
                        that.setValue(that.originalValueWGSLatitude, newValue);
                        that.watchUpdating = false;

                        //releaseWatchHandle();
                    });
                    
                }
            };

            this.watchBindable();

            //GeographicConverterService.registerToLoadQueue(this.geographicConverterServiceLoaded);
            Hermes.onComponentLoaded(GeographicConverterService, this.geographicConverterServiceLoaded);


        }]);
})();