(function (){
    'use strict';

    MainApp.controller( 'TestContainerController', [ '$scope',
        function($scope){
             
             var that = this;
             
             this.dataModel = {};
             this.dataModel.latitude = 22;
             this.dataModel.longitude = 35;

             

        }]);
})();