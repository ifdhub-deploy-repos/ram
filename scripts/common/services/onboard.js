//This is the main API service which connects to the MicrositeAPI
//The API base URL and the languageID are global variables and are defined in /app.js
(function () {
    'use strict';

    angular.module('services.onboard', ['ngCookies'])
     .factory('onboard', ['$http','$cookieStore', '$location', onboard ]);

    function onboard($http, $cookieStore, $location) {
//        var getAllLanguages = function () {
//            var api_url = api_base + "/localisation/languages";
//            return $http.get(api_url, { cache: false})
//              .then(function (response) {
//                  return response.data;
//              });
//        };
        var url;
        var currentlabel = [{
              onboardName:"_onboard"
        }]; 
    
//        console.log("currentlabel Start", currentlabel);
    
       
        

       
//        console.log("currentlabel Start" + currentlabel);

        var getOnboardList= function () {
            var onboardData = [
          {  id:0, name: "_movies", link:"app.movies.list"},
          {  id:1,name: "_tv",link:"app.tvs.list" }
//          {  id:2, name: "_audios",link:"app.audios.list" }
        ];
         return  onboardData ;
     };
  
  
 
     
         var setCurrentLabel= function (onboardID, onboardName) {
//              console.log("onboardID inside service" + onboardID);
//              console.log("onboardName inside service" + onboardName);
            
              
               currentlabel = [{
                   id: onboardID,
                   onboardName:onboardName
              }];
          
          
//           console.log("currentlabel get", currentlabel);
          return currentlabel;
       
         
     };
   
//        var getCurrentLabel= function () {
//            console.log("currentlabel outside", currentlabel);
//            return currentlabel;
//     };
       
      
          var getCurrentLabel= function () {
              
               url = $location.url();
               var urlnew   =  url.substring(1);
//               console.log("urlnew:" +  urlnew);
                var label = '_' + urlnew;
//                console.log("label:" +  label);
                
               if(label === '_'){ 
               currentlabel= [{onboardName:"_onboard"}];
               }else{
                   
                   if(label.indexOf('?') > -1)
                    {
                        
                    var labelCut =  label.substring(0, label.indexOf('?')); 
                       currentlabel= [{onboardName:labelCut}];
                      
                    }else{
                        
                      currentlabel= [{onboardName:label}];
                    } 
                        
               };
               
            
               
//               console.log(currentlabel);
               
            return currentlabel; 
     };
         
        return {
            
            getOnboardList: getOnboardList,
            setCurrentLabel:setCurrentLabel,
            getCurrentLabel:getCurrentLabel
        };

    };
}());


//              url = $location.url();
//               var urltemp   =  url.substring(1);
//               
////               var urlnew = urltemp.substring(0, urltemp.indexOf('?')); 
//               console.log("urlnew:" +  urlnew );
//               
//               var label = '_' + urlnew ;
//               currentlabel= [{onboardName:label}]
//               
//               console.log(label);