//This service store the last selected items 
(function () {
    'use strict';

    angular.module('services.themeServices', [])
     .factory('themeServices', [themeServices]);
      var langStore ;
       function themeServices($rootScope) {
           
         var setlangaugeStore = function(cd){   
           langStore = cd ;  
          console.log('langStoreSet:  ' + langStore);
          return langStore
         };
         
        
         var getlanguage = function () {
          var getStoreLang = langStore ;
          console.log("langStoreTest: " + langStore);
           
          return getStoreLang ;
       
        };
     
    
        return {            
            
        setlangaugeStore: setlangaugeStore,
        getlanguage:getlanguage
        };
        
        
    };
}());
