(function (){
    'use strict';
    MainApp.service('SettingsLoaderService', [ '$http', 'ObjectInstantiatorService',
        function ($http,ObjectInstantiatorService){

        var that = this;

        this.loadSettings = function(options){

            return $http.get(options.jsonUrl).then(function(response){
                var responseFromServer = response.data;
                var recursivelyInstantiateObjectIfNeeded = ObjectInstantiatorService.instantiateObject(responseFromServer);
                var settingsPropertyName = options.settingsPropertyName;
                if(!settingsPropertyName){
                    settingsPropertyName = "settings";
                }
                options.caller[settingsPropertyName] = recursivelyInstantiateObjectIfNeeded;
                if(options.callback){
                    options.callback.call();
                }
            });

        };

        }]);
})();