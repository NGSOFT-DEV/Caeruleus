(function(window) {'use strict';
      var hermes = JSON.parse(`{
  "author": "NGSoft",
  "name": "Caeruleus",
  "version": "1.0.0" 
}
`);
      hermes.environment = 'development';
      hermes.buildTimeStamp = new Date('2017-02-08T11:49:54.302Z');
      hermes.gruntVersion = '1.0.1';
      hermes.events = {};
      window['Hermes'] = hermes;
      var loadDetails = '[ application: '+hermes.name+', version: '+hermes.version+', environment: '+hermes.environment+', buildTimeStamp: '+hermes.buildTimeStamp+', grunt version: '+hermes.gruntVersion+']';
      
      var hermesSymbol = Symbol('hermes');
      var hermesLoadQueueSymbol = Symbol('hermes_loadQueue');
      var hermesComponentLoadedSymbol = Symbol('hermes_componentLoaded');
      var hermesRegisterToLoadQueueSymbol = Symbol('registerToLoadQueue');
      var hermesTriggerLoadedSymbol = Symbol('triggerLoaded');
      var hermesIsComponentLoadedSymbol = Symbol('isComponentLoaded');

      var hermesEnhancer = {};
      var registerToLoadQueue = function(callback){
        var loaded = this[hermesComponentLoadedSymbol];
        if(loaded){
          callback.call();
        }
        else{
          if(this[hermesLoadQueueSymbol] === undefined){
            this[hermesLoadQueueSymbol] = [];
          }

          this[hermesLoadQueueSymbol].push(callback);
        }
      };
      var triggerLoaded = function(){
        this[hermesComponentLoadedSymbol] = true;
        
        var loadQueue = this[hermesLoadQueueSymbol];
        if(loadQueue === undefined){
          return;
        }

        for(var i=0;i<loadQueue.length;i++){
          var currentCallback = loadQueue[i];
          currentCallback.call();
        }
      };

      var isComponentLoaded = function(){
        return this[hermesComponentLoadedSymbol];
      };
      
      //Object.prototype[hermesComponentLoadedSymbol] = false;
      Object.prototype[hermesRegisterToLoadQueueSymbol] = registerToLoadQueue;
      Object.prototype[hermesTriggerLoadedSymbol] = triggerLoaded;
      Object.prototype[hermesIsComponentLoadedSymbol] = isComponentLoaded;

      hermes.onComponentLoaded = function(component, callback){
        component[hermesRegisterToLoadQueueSymbol](callback);
      };

      hermes.componentLoaded = function(component){
        component[hermesTriggerLoadedSymbol]();
      };

      hermes.isComponentLoaded = function(component){
        component[hermesIsComponentLoadedSymbol]();
      };

      hermes.registerEvent = function(eventName, callback){
        var events = hermes.events;
        var event = events[eventName];
        if(event === undefined){
          events[eventName] = [];
          event = events[eventName];
        }

        event.push(callback);

      };

      hermes.fireEvent = function(eventName, ...args){
        var events = hermes.events;
        var event = events[eventName];
        if(event === undefined){
          return;
        }

        for(var i=0;i<event.length;i++){
          var currentCallback = event[i];
          currentCallback(...args);
        }

      };


      console.group('%c(HRM)Hermes Runtime Manager has been loaded ', 'color: #334CF;');
      console.info('%cApplication: ', 'color: #334CFF', hermes.name);
      console.info('%cVersion: ', 'color: #334CFF', hermes.version);
      console.info('%cEnvironment: ', 'color: #334CFF', hermes.environment);
      console.info('%cBuild timestamp: ', 'color: #334CFF', hermes.buildTimeStamp);
      console.info('%cGrunt version: ', 'color: #334CFF', hermes.gruntVersion);
      console.log('%c☤', 'color: #334CFF;font-size: 64px;"');
      console.groupEnd();

    })(window);