
'use strict';
angular.module('inflightApp.inflight', [
  'inflightApp.home',

  'inflightApp.movies',
  'inflightApp.tv',
  'inflightApp.audio',
  'inflightApp.shaw',
  'inflightApp.ticketmaster'
  
//  'inflightApp.games',
//  'inflightApp.publications',
//  'inflightApp.dutyfree',
])
.config(function($stateProvider){
  $stateProvider.state('app.inflight', {
    url: '/inflight',
    views: {
      'main': {
        templateUrl: 'scripts/modules/inflight/inflight.tpl.html'
      }
    }
  });
})

.controller('InflightCtrl', function($scope){

});
