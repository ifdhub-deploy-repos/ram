'use strict';

angular.module( 'inflightApp.actionmodal', [
//  'inflightApp.player',
  'ngAnimate',
  "ngSanitize",
  'inflightApp.movies',
//  "videogular",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.buffering",
  "com.2fdevs.videogular.plugins.poster",
//  'inflightApp.movies',
  "services.media"
  
  ])

.directive('modal',  function() {
  return {
    
   restrict: "E",
   controller: function ($scope, $state){
       
    $scope.refreshState = function(){
    console.log("refreshState");
    $state.forceReload();
    };
       
  },
  
    
    
    scope: {
      show: '='
    },
    
    
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs ) {
        
   
        
    scope.hideModal = function() {
    scope.show = false;
          
      };
    },
     
     
   template: "<div class='ng-modal' ng-show='show'>"+  
           
                "<div class='reveal-modal' ng-show='show'>"+          
                  "<div ng-transclude></div>"+
                 
                    "<a class='close-reveal-modal' ng-click='hideModal(); refreshState ()'>&#215;</a>"+
                "</div>"+
                "<div class='reveal-modal-bg' ng-click='hideModal(); refreshState ()'></div>"+
              "</div>"
     
  };
                

});