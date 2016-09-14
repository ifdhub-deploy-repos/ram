(function () {
   'use strict';




angular.module('inflightApp.wifi', [
 
 'ui.router'
])
.config(function($stateProvider){

  $stateProvider.state ('app.wifi', {
      abstract: true,
      url: '/on',
      views: {
        'main': {
          template: '<div ui-view ></div>'
        }
      }
    })
  .state('app.wifi.on',  {
    url: '/wifi',
    controller: 'WifiCtrl', 
    templateUrl: 'scripts/modules/wifi/wifi.tpl.html',
    data: { title: 'Wifi' }
       
   
      })  .state('app.wifi.detail', {
      url: '/:id',
      controller: 'WifiCtrl',
      templateUrl: 'scripts/modules/wifi/views/wifi-detail.tpl.html',
      data: { title: 'menu_inflight_movies' }
     
    });
}).controller('WifiCtrl', function($scope,$rootScope, $filter, micrositeApi,$translate,$location,$window,selector){
  
    var allMovies;


    //init translate
    $translate('application_filter')
        .then(function (translatedValue) {
            $scope.dropdownCurrentLabel = translatedValue;
        });
    
 //Filter results by location search parameters
    var filterResultsByLocation = function(){
        var url = $location.url(),
            locationQuery = $location.search();

               //check if we should filter (only if location is present)

                if(locationQuery.catID!==null){

                    var categoryID =locationQuery.catID;
                    var categoryName =locationQuery.cat;


                    console.log('Filtering',categoryID);
                    //set the dropdown
                    $scope.dropdownCurrentLabel=categoryName;
                    //filter
                     var filteredMovies;

                    if(categoryID==='0'){
                        //only sort A-Z
                            filteredMovies =  $filter('orderBy')(allMovies, 'contentMeta.title');
                    } else {
                        //filter
                             filteredMovies = _.filter(allMovies, function(item){
                             return item.categoryID==categoryID;
                            });
                    }



                    $scope.wifimovies=filteredMovies;
                }
    };
    

     var onSuccess = function (data) {
          //filter results if flight is selected on route selector page
         allMovies = selector.filterContentForSelectedFlight(data);
         console.info(allMovies);
        $scope.movies = $filter('orderBy')(selector.filterContentForSelectedFlight(data), 'contentMeta.title');
        filterResultsByLocation();
    };
    //api call to get all movies
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("movies").then(onSuccess);

    
    //get all categories then filter by Parent category name 
    micrositeApi.getAllCategories().then(function(data){
        //get all child categories of the category ID 68 (Movies)
       var categories= micrositeApi.getAllSubcategoriesOfParentCategory(data, 468);
       $scope.dropdownCategories = categories;
        //console.log('Sub Categories:', categories);
    });
    




        //want to know whenever $location changes
        $rootScope.$on('$locationChangeSuccess', function(event){
            filterResultsByLocation();
        });



    //filter by category
    $scope.filterByDropdownCategory = function(categoryID,categoryName){
        
        // set category in URL
        $location.search('catID', categoryID);
        $location.search('cat', categoryName);

        $scope.dropdownCurrentLabel=categoryName;
        var filteredMovies;
        
        if(categoryName==='A-Z'){
            //only sort A-Z
                filteredMovies =  $filter('orderBy')(allMovies, 'contentMeta.title'); 
        } else {
            //filter
                 filteredMovies = _.filter(allMovies, function(item){
                 return item.categoryID===categoryID;
                });   
        }
        $scope.movies=filteredMovies;
      
    };
    
    
})

.controller('MovieCtrl', function($scope, $stateParams, $state, $translate, micrositeApi,selector){
  var movieTitle = $stateParams.id;
   
  console.log('MovieTile =' + movieTitle);

    
     var onSuccess = function (data) {
            //filter movie by title
            var movie = _.filter(data, function(item) {
                return item.contentMeta.title == $stateParams.id;
            });
            //get the first element in array
            $scope.movie= movie[0];
            $scope.movies = _.shuffle(selector.filterContentForSelectedFlight(data));
        };
    //api call to get all moveis
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("movies").then(onSuccess);
    
    //TODO
    $scope.viewMovie = function(){
        $state.go('app.playmovie', { id: $scope.movie.contentMeta.title });  
    };
});

}());