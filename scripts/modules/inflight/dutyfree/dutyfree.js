
'use strict';
angular.module('inflightApp.dutyfree', [])
.config(function($stateProvider){
  $stateProvider
    .state('app.dutyfree', {
      url: '/dutyfree',
      data: { title: 'menu_inflight_duty_free' },
      views: {
        'main': {
          controller: 'DutyFreeCtrl',
          templateUrl: 'scripts/modules/inflight/dutyfree/dutyfree-catalog.tpl.html'
        }
      }
    })
    .state('app.dutyfreecatalog', {
      url: '/dutyfreecategory/:id',
      data: { title: 'menu_inflight_duty_free' },
      views: {
        'main': {
          controller: 'DutyFreeCatalogCtrl',
          templateUrl: 'scripts/modules/inflight/dutyfree/dutyfree-category.tpl.html'
        }
      }
    })
})

.controller('DutyFreeCtrl', function ($scope,$http,$rootScope, micrositeApi, selector) {

    var onSuccess = function (data) {
        //filter results if flight is selected on route selector page
        //$scope.dutyFreeCategories = selector.filterContentForSelectedFlight(data);
        //if you wish to display all items without route selector filtering remove the method selector.filterContentForSelectedFlight()
        $scope.dutyFreeCategories = data; //this will display all items, without filtering
    }

    //api call to get all duty free categories
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("duty_free_category").then(onSuccess);
})

.controller('DutyFreeCatalogCtrl', function ($scope, $stateParams, $http, micrositeApi) {


    var onSuccess = function (data) {
        $scope.dutyFreeProducts = data;
    }

    //api call to get all duty free categories
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    var product_category_id= $stateParams.id;
    micrositeApi.getAllContentItemsByTypeAndMeta("duty_free_product", "product_category_id", product_category_id).then(onSuccess);


})

.controller('DutyFreeItemCtrl', function($scope, $stateParams){

});
