
'use strict';
angular.module('inflightApp.menu', [
  
  
])
.config(function($stateProvider){
  $stateProvider
  
    .state('app.menu', {
    url: '/menu',
    data: { title: 'menu_inflight_menu' },
    views: {
      'main': {
        controller: 'MenuCtrl',
        templateUrl: 'scripts/modules/menu/menu.tpl.html'
      }
    }
  });
}).controller('MenuCtrl', function MenuCtrl($scope,$http, micrositeApi, selector) {
    
    
    
    
    var onSuccess = function (data) {
        //filter results if flight is selected on route selector page
        var allMenu = selector.filterContentForSelectedFlight(data);
        //filter menu items by type
        $scope.main = _.where(allMenu, function(item){return item.contentMeta.menu_type=='main'});
        $scope.dessert = _.where(allMenu, function(item){return item.contentMeta.menu_type=='dessert'});
        $scope.sandwich = _.where(allMenu, function(item){return item.contentMeta.menu_type=='snacks'});
       // console.log('Main Courses ', $scope.main);
    }

    //api call to get all menu items
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("menu").then(onSuccess);
    
    
    
     var onSliderSuccess = function (data) {
        $scope.sliders = data;
    }
     
     //resolve the menu type(economy or business)
    var selectedFlightDetails= selector.getFlightSelection();
    if(selectedFlightDetails!=null){
        $scope.selectedFlightDetails = selectedFlightDetails;
        
        
        //api call to get menu sliders
        //get the content type of slider, filter by contentMeta.slide_location = "Menu"
        micrositeApi.getAllContentItemsByTypeAndMeta("slider", "slide_location", selectedFlightDetails.class=="15"?"Menu(Economy)":"Menu(Business)").then(onSliderSuccess);
        
    }
    console.log('reading selectedFlightDetails', selectedFlightDetails);
    
});
