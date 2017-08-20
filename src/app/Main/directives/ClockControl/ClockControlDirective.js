(function (){
    'use strict';
    MainApp.directive('clockControl', [
        function (){
            return {
                restrict: 'E',
                templateUrl: 'Main/directives/ClockControl/ClockControl.tpl.html',
                controller: 'ClockControlController',
                controllerAs: 'clockControlController'
            };
        }]);
})();