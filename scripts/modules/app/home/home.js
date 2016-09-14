

angular.module('inflightApp.home', [

   
])
.config(function ($stateProvider) {



    $stateProvider
      .state('app.home', {         
          url: '/onboard',
          data: { title: '_home' },
          views: {
              'main': {
                  controller: 'MoviesCtrl',
                  templateUrl: 'scripts/modules/inflight/movies/views/movies.tpl.html'}         
          }
      });
})
.controller('HomeCtrl', function ( $cookieStore, $scope, $state, micrositeApi, selector, selectorCus, $window,  $timeout) {

   
    var languageID = $cookieStore.get('langId');
    
    if(languageID === 111){

    $scope.classVar =true;
    }else{
    $scope.classVar =false;
    }
    
    
    var onSliderSuccess = function (data) {
        $scope.sliders = data;
    };
    //api call to get home sliders
    //get the content type of slider, filter by contentMeta.slide_location = "Route Selector"
    micrositeApi.getAllContentItemsByTypeAndMeta("slider", "slide_location", "Route Selector").then(onSliderSuccess);


var selectedState ={};
    var selectedStateTo ={};


         /*****   
         Select click runs CusSaveSelector function 
         First Checks if we have an empty selection
         Longhaul send us to the movie
         Shorthaul send us to wifi page ******/
    
          $scope.CusSaveRouteSelector = function(state, stateto) {
              
                var currentTrack = state;
                var currentTrackTo =stateto;
                   
                      
                      if (currentTrack  == undefined | currentTrackTo== undefined){
                
                console.log("empty Selection ");
                $scope.homealert= "Opps you need to make a selection" ;
                $scope.homealertempty= "" ;
                $timeout(function () { $scope.homealert = $scope.homealertempty= "" ;}, 3000); 
                
                      selectedState ={};
                     selectedStateTo ={};
                
                }else{
                      
                     selectorCus.setModelFrom(currentTrack);
                     selectorCus.setModelTo(currentTrackTo);
                     console.log('selector.setModel currentTrack :' + currentTrack );
              
              
//            If selections are empty   
                          
           
                                             
            if(currentTrackTo.type === 'longhaul'){
                               $state.go('app.movies.list');
                            }
            if(currentTrackTo.type=== 'shorthaul'){
                    $window.location.href = 'https://www.norwegian.com/uk/travel-info/on-board/free-wifi/';
                }
            }
                
    };
    
         var trackid= selectorCus.getModelFrom();
//         console.log('selector.getModeltrackid :' + trackid);
         var trackidto= selectorCus.getModelTo();
//         console.log('selector.getModeltrackidto :' + trackidto);
        if(trackid!==null ){
                $scope.selectedState = trackid;
                $scope.selectedStateTo = trackidto;
             
            } else {
                //empty
                 selectedState = {id: 0, name: "Default"}; 
                $scope.selectedFlightDetails= selectedState; 
                 $scope.selectedFlightDetails=  selectedStateTo ; 
            }

    
    
    
    
}).service('selectorCus', function(){
        var mySelectFrom;
        var mySelectTo;
        return{
            setModelFrom: function(model){
             mySelectFrom= model;
                            
            },
             setModelTo: function(modelto){
             mySelectTo= modelto;
              
            },
            
            getModelFrom: function(){   
                                
//                console.log('ServicegetModelFrom');
                return  mySelectFrom;
            },
            getModelTo: function(){   
                                
//                console.log('ServicegetModelTo');
                return  mySelectTo;
            }
        }   
    })

