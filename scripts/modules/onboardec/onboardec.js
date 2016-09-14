
'use strict';
angular.module('inflightApp.onboardec', [
 
 'ui.router'
])
.config(function($stateProvider){

  $stateProvider.state ('app.onboard', {
      abstract: true,
      url: '/on',
      views: {
        'main': {
          template: '<div ui-view ></div>'
        }
      }
    })
  .state('app.onboard.ec',  {
    url: '/onboardec',
    controller: 'OnboardCtrl', 
    templateUrl: 'scripts/modules/onboardec/onboardec.tpl.html',
    data: { title: 'menu_inflight_onboard' }
       
   
  }).state('app.onboard.crewdetails',  {
      
    url: '/crewdetails:id',
    controller: 'OnboardCtrl', 
    templateUrl: 'scripts/modules/onboardec/views/_crewDetails.tpl.html',
    data: { title: 'menu_inflight_onboard' }
    
       
   
  });

 

  
}).controller('OnboardCtrl',["$scope", "$stateParams", "selector","micrositeApi","$state",  function($scope, $stateParams, selector, micrositeApi,$state,$location ){
    

  console.log("onboardCtrl");
  //  console.log($rootScope.class);
  
    
     //resolve the flight class type(economy or business)
    var selectedFlightDetails= selector.getFlightSelection();
    if(selectedFlightDetails!==null){
        $scope.selectedFlightDetails = selectedFlightDetails;
        
        var sliderClass= selectedFlightDetails.class ;
        
         var onSliderSuccess = function (data) {
            $scope.sliders = data;
            };  //api call to get menu sliders
         micrositeApi.getAllContentItemsByTypeAndMeta("slider", "slide_location", selectedFlightDetails.class==='15'?"OnBoard(Economy)":"OnBoard(Business)").then(onSliderSuccess);
        
        var onSliderEntertainmentSuccess = function (data) {
            $scope.slidersEntertainment = data;
            }; //api call to get menu sliders
         micrositeApi.getAllContentItemsByTypeAndMeta("slider", "slide_location", selectedFlightDetails.class==='15'?"OnBoard Entertainment(Economy)":"OnBoard Entertainment(Business)").then(onSliderEntertainmentSuccess);
        
        
              
    }
    console.log('reading selectedFlightDetails', selectedFlightDetails);
    
    

   var serviceData = [
       {'type':'menu_inflight_movies' , 'state':'app.movies.list', 'image':'movies'},
       {'type':'menu_inflight_tv', 'state':'app.tvs.list', 'image':'tv'},
       {'type':'menu_inflight_audio', 'state':'app.audios.list', 'image':'audio'},
       {'type':'menu_inflight_publications', 'state':'app.publications.list', 'image':'publications'},
       {'type':'menu_inflight_games', 'state':'app.games.list', 'image':'games'}
      ];
    
   $scope.categories = serviceData;
   
    var DutyFreeData = [
       {'id':'1201','type':'section_onboard_dutyfree_fragrances','image':'2' },
       {'id':'1200', 'type':'section_onboard_dutyfree_cosmetics','image':'1'},
       {'id':'1202','type':'section_onboard_dutyfree_skincare','image':'3' },
       {'id':'1203','type':'section_onboard_dutyfree_jewellery','image':'4' },
       {'id':'1207','type':'section_onboard_dutyfree_sccessories','image':'5' },
       {'id':'1208','type':'section_onboard_dutyfree_kids','image':'6' },
       {'id':'1209','type':'section_onboard_dutyfree_sweets','image':'7' },
       {'id':'1210','type':'section_onboard_dutyfree_tobacco','image':'8'},
       {'id':'1211','type':'section_onboard_dutyfree_alcohol','image':'9'}
      
       ];
  
    
   $scope.duty = DutyFreeData;

  
  //Cabin Crew

 var allCrew;
    
     var onSuccess = function (data) {
          //filter results if flight is selected on route selector page
          allCrew = data;
         $scope.crewMember = allCrew;
         $scope.currentMember= $stateParams.id;
    };
    //api call to get all movies
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("crew").then(onSuccess);
    
    
    $scope.cancelDetail = function(){
         
        $state.go('app.onboard.ec');  
    };
   
    $scope.gotoTop = function (){
     // set the location.hash to the id of
     // the element you wish to scroll to.
         $location.hash('top');

     // call $anchorScroll()
     $anchorScroll();
};
  
}]);
