(function () {
   'use strict';

angular.module('inflightApp.shaw', [ 
    
  'themeConfig'
])
.config(function($stateProvider, data){
    
      var theme = data;
 
   $stateProvider
    .state('app.shaw', {
      abstract: true,
      url: '/',
      title: 'Entertainment',
      views: {
        'main': {          
          template: '<div ui-view ></div>'
        }
      }
    })
    .state('app.shaw.list', {
      url: 'shaw',
      cache: false,
      controller: 'shawCtrl',
      templateUrl: 'scripts/modules/inflight/shaw-academy/views/shaw.tpl.html',
      data: { title: '_shaw' }
    
    })
    .state('app.shaw.tutorials', {
      url: 'shaw/details/:id',
      controller: 'shawCtrl',
      templateUrl: 'scripts/modules/templates/' + theme + '/tmpl_details/shaw-detail.tpl.html',
      data: { title: '_shaw' }
     
    });
      
 
})
.controller('shawCtrl', function($scope){
    
     
      
   
  });
}());