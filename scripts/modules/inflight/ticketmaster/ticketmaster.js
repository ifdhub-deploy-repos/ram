(function () {
   'use strict';

angular.module('inflightApp.ticketmaster', [ 
    
  'themeConfig'
])
.config(function($stateProvider, data){
    
      var theme = data;
 
   $stateProvider
    .state('app.ticketmaster', {
      abstract: true,
      url: '/',
      title: 'Entertainment',
      views: {
        'main': {          
          template: '<div ui-view ></div>'
        }
      }
    })
    .state('app.ticketmaster.main', {
      url: 'ticketmaster',
      cache: false,
      controller: 'ticketmasterCtrl',
      templateUrl: 'scripts/modules/inflight/ticketmaster/views/ticketmaster.tpl.html',
      data: { title: '_ticketmaster' }
    
    });
  
      
 
})
.controller('ticketmasterCtrl', function($scope){
    
     
      
   
  });
}());