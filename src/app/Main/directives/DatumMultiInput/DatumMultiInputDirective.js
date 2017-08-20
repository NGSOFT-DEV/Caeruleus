(function (){
    'use strict';
    MainApp.directive('datumMultiInput', [
        function (){
            return {

                restrict: 'E',
                templateUrl: 'Main/directives/DatumMultiInput/DatumMultiInput.tpl.html',
                controller: 'DatumMultiInputController',
                scope: true,
                bindToController:{
                    ngModel: '@'
                },
                controllerAs: 'datumMultiInputController'
            };
        }]);
})();