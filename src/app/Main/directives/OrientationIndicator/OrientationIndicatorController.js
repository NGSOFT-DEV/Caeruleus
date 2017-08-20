(function (){
    'use strict';

    MainApp.controller( 'OrientationIndicatorController', [ '$http','CesiumWrapperService',
        function($http, CesiumWrapperService){

            var that = this;
            that.heading = 3;

            var refreshOrientationFunction = function(newHeading, oldHeading){

                that.heading = newHeading;
                var orientationIndicationNeedleElement = $('#orientationIndicationNeedle');
                orientationIndicationNeedleElement.css('transform','rotate('+-that.heading+'rad )');
            };

            this.loadDefinitionsFromJson = function(){
                var jsonUrl = "assets/OrientationIndicatorSettings.json";
                return $http.get(jsonUrl).then(function(response){
                    var responseFromServer = response.data;
                    that.indicatorForeImage = responseFromServer.indicatorForeImage;
                    that.indicatorBackImage = responseFromServer.indicatorBackImage;
                });

            };

            this.loadDefinitionsFromJson();
            CesiumWrapperService.subscribeToHeadingChanged(refreshOrientationFunction);

        }]);
})();