(function (){
    'use strict';
    MainApp.directive('cesiumContainer', [
        function (){
            return {
                restrict: 'E',
                templateUrl: 'Main/directives/CesiumContainer/CesiumContainer.tpl.html',
                controller: 'CesiumContainerController',
                controllerAs: 'cesiumContainerController'
            };
        }]);
})();