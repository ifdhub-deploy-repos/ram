
'use strict';
angular.module('inflightApp.preview', [])
.config(function($stateProvider){
  $stateProvider

     .state('app.preview', {         
          url: '/preview',
          data: { title: '_home' },
          views: {
              'main': {
                  controller: 'PreviewCtrl',
                  templateUrl: 'scripts/modules/inflight/preview/views/preview.tpl.html'}         
          }
      });
   
}).controller('PreviewCtrl', function ( $scope, $rootScope, $filter, micrositeApi, $translate, $location, $window, selector) {


    
    
});



