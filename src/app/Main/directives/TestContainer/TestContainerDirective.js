(function (){
    'use strict';
    MainApp.directive('testContainer', [
        function (){
            return {
                scope:{},
                restrict: 'E',
                templateUrl: 'Main/directives/TestContainer/TestContainer.tpl.html',
                controller: 'TestContainerController',
                controllerAs: 'testContainerController'
            };
        }]);
})();