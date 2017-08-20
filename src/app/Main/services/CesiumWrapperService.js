(function (){
    'use strict';
    MainApp.service('CesiumWrapperService', [ 'SettingsLoaderService',
        function (SettingsLoaderService){

        var that = this;

        //window.alert(Hermes.environment);

        //Name spaces for the framework
        window.Caeruleus = this;
        window.Caeruleus.SettingsLoader = SettingsLoaderService;

        this.loadQueue = [];
        this.headingChangedSubscribers = [];
        this.previousHeading = undefined;

        this.initializeCesiumViewer = function(){

            that.processAdditionalOptionsIntoViewerOptions();
            that.viewer = new Cesium.Viewer('cesiumContainer', that.settings.viewerOptions);

            var globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
            that.viewer.globe = globe;

            that.viewer.scene.sun.show = true;
            that.viewer.scene.moon.show = true;

            that.viewer.scene.postRender.addEventListener(that.onPostRender);

            for(var i=0;i<that.loadQueue.length;i++){
                that.loadQueue[i].call();
            }


        };

        this.onPostRender = function(){

            var newHeading = that.viewer.scene.camera.heading;
            if(newHeading!=that.previousHeading){
                that.onHeadingChanged(newHeading, that.previousHeading);
                that.previousHeading = newHeading;
            }
        };

        this.onHeadingChanged = function(newValue,oldValue){
            Hermes.fireEvent('HeadingChanged', newValue, oldValue);
        };

        this.subscribeToHeadingChanged = function(func){
            Hermes.registerEvent('HeadingChanged', func);
        };

        this.processAdditionalOptionsIntoViewerOptions = function(){

            var additionalOptions = that.settings.additionalOptions;

            if(additionalOptions){
                if(additionalOptions.useCesiumMoonSingleImageryProvider){
                    var cesiumMoonImageryProvider = new Cesium.SingleTileImageryProvider({
                        url: 'vendor/cesium/1.18/CesiumUnminified/Assets/Textures/moonSmall.jpg'
                    });
                    that.settings.viewerOptions.imageryProvider = cesiumMoonImageryProvider;
                }

                if(additionalOptions.useCesiumNaturalEarth2ImageryProvider){
                    var naturalEarthImageryProvider = new Cesium.TileMapServiceImageryProvider({
                        url: 'vendor/cesium/1.18/CesiumUnminified/Assets/Textures/NaturalEarthII'
                    });
                    that.settings.viewerOptions.imageryProvider = naturalEarthImageryProvider;
                }

                if(additionalOptions.baseProvider && additionalOptions.baseProvider.enabled){

                    var baseProviderObject = additionalOptions.baseProvider;
                    if(baseProviderObject){
                        that.settings.viewerOptions.imageryProvider = baseProviderObject;
                    }
                }

            }
        };

        this.addPostRenderListener = function(func){
            if(that.viewer){
                that.viewer.scene.postRender.addEventListener(func);
            }
            else{
                that.loadQueue.push(function(){that.viewer.scene.postRender.addEventListener(func);});
            }
        };

        this.tileLoadProgressListener = function(func){
            if(that.viewer){
                that.viewer.scene.globe.tileLoadProgressEvent.addEventListener(func);
            }
            else {
                that.loadQueue.push(function(){that.viewer.scene.globe.tileLoadProgressEvent.addEventListener(func);});
            }
        };

        Caeruleus.SettingsLoader.loadSettings({jsonUrl: "assets/CesiumContainerSettings.json", caller: this, callback: this.initializeCesiumViewer});

        }]);
})();