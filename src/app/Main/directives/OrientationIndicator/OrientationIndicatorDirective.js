(function (){
    'use strict';
    MainApp.directive('orientationIndicator', [
        function (){
            return {
                restrict: 'E',
                templateUrl: 'Main/directives/OrientationIndicator/OrientationIndicator.tpl.html',
                controller: 'OrientationIndicatorController',
                controllerAs: 'orientationIndicatorController'
            };
        }]);
})();