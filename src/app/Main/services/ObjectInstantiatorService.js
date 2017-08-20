(function (){
    'use strict';
    MainApp.service('ObjectInstantiatorService', [
        function (){

        var that = this;

        this.instantiateObject = function(jsonObject, lookUpRoot){

            if((typeof jsonObject) != "object"){

                jsonObject = that.injectByLookUpRoot(jsonObject, lookUpRoot);
                return jsonObject;
            }

            var resultObject = jsonObject;

            if(jsonObject.hasOwnProperty("ObjectInstantiatorService[type]")){
                var classNameReference = jsonObject["ObjectInstantiatorService[type]"];

                var classNameReferences = classNameReference.split('.');

                var constructorFunc = window;

                for(var i=0;i<classNameReferences.length;i++){
                    constructorFunc = constructorFunc[classNameReferences[i]];
                }


                var prototype = constructorFunc.prototype;
                //var DummyFunc = function(){};
                //DummyFunc.prototype = constructorFunc.prototype;

                resultObject = Object.create(prototype);

                var parametersArrayJson = jsonObject["ObjectInstantiatorService[parameters]"];
                var parametersArrayResult = [];

                if(!lookUpRoot){
                    lookUpRoot = resultObject;
                }
                if(parametersArrayJson){
                    for(var j=0;j<parametersArrayJson.length;j++){
                        var currentParameterJsonObject = parametersArrayJson[j];
                        parametersArrayResult.push(that.instantiateObject(currentParameterJsonObject, lookUpRoot));

                    }
                }

                var output = constructorFunc.apply(resultObject, parametersArrayResult);
                if(output){
                //some constructors return the object while others don't - js go figure ....
                    resultObject = output;
                }
                //resultObject.constructor = constructorFunc;


            }

            if(!lookUpRoot){
                lookUpRoot = resultObject;
            }
            for(var property in jsonObject){
                if(property!="ObjectInstantiatorService[type]"&&property!="ObjectInstantiatorService[parameters]"){
                    resultObject[property] = that.instantiateObject(jsonObject[property], lookUpRoot);
                }
            }


            return resultObject;


        };

        this.injectByLookUpRoot = function(exp, lookUpRoot){

            if((typeof exp) === "string"){
                if(exp.indexOf("ObjectInstantiatorService[")>-1){

                    var result="";
                    var splitedExpForLookup = exp.split(']');
                    for(var i=0;i<splitedExpForLookup.length;i++){

                        var lookupValue = lookUpRoot;
                        var currentExpPart = splitedExpForLookup[i];

                        if(currentExpPart.indexOf("ObjectInstantiatorService[")>-1){

                            var innerBracketsExp = currentExpPart.split('[')[1];
                            var hierarchy = innerBracketsExp.split('.');


                            for(var j=0;j<hierarchy.length;j++){

                                lookupValue = lookupValue[hierarchy[j]];
                            }

                            result+=lookupValue;
                        }
                        else{
                            result+=currentExpPart;
                        }
                    }

                    return result;
                }
            }

            return exp;
        };


        }]);
})();