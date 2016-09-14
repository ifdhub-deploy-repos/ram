(function () {
   'use strict';

angular.module('inflightApp.movies', [ 
    
  'themeConfig'
])
.config(function($stateProvider, data){
    
      var theme = data;
 
   $stateProvider
    .state('app.movies', {
      abstract: true,
      url: '/',
      title: 'Entertainment',
      views: {
        'main': {          
          template: '<div ui-view ></div>'
        }
      }
    })
    .state('app.movies.list', {
      url: 'movies',
      cache: false,
      controller: 'MoviesCtrl',
      templateUrl: 'scripts/modules/inflight/movies/views/movies.tpl.html',
      data: { title: '_movies' }
    
    })
    .state('app.movies.movie', {
      url: 'movie/details/:id',
      controller: 'MovieCtrl',
      templateUrl: 'scripts/modules/templates/' + theme + '/tmpl_details/movie-detail.tpl.html',
      data: { title: '_movies' }
     
    });
      
 
})
.controller('MoviesCtrl', function($scope, $rootScope, $filter, micrositeApi,
                                   $translate, $location, $window, selector,
                                   onboard, data, movieCat, 
                                   movieNewRelease, movieAllFilter, $state ){
     
    //  Sets Page title
    $translate('_movies').then(function (translatedValue) { $scope.contentTile = translatedValue;});
    $scope.query={term:''};
    var allMovies;
   
//   Loads the movie slider onto the page 
     $scope.slider = { 
         setSliderFolder: "movie",
         slide_01: "slider_movie.jpg"
     };
    
  
    //Filter Button Translate Function.This code translates
    // the default filter label when you first enter the movie
    //  page.Other filters translation are create such as classics 
    //  and newrealeases are controlled in the cms 
    $translate('_filter')
        .then(function (translatedValue) {
            $scope.dropdownCurrentLabel = translatedValue;
//            console.log(" Inside Location Function  translatedValue:" + translatedValue);
        });
        
 
         
//      $scope.currentlabelDropdownOnboard = $scope.currentlySelected;
      $scope.currentlabelDropdownOnboard = onboard.getOnboardList();
     
     $scope.filterByDropdownCategoryOnboard = function(onboardID,onboardName){
        // set category in URL
//         console.log('onboardID'+ onboardID);
//         console.log('onboardName'+ onboardName);
        
     
         onboard.setCurrentLabel(onboardID,onboardName);
         
           
//      $translate('_filter')
//        .then(function (translatedValue) {
//            $scope.dropdownCurrentLabelOnboard = translatedValue;
//            console.log(" DropDown translatedValue" + translatedValue);
//        }); 
//        

     };
    
    // Filter Function that changes when
    // The location changes  search parameters
    var filterResultsByLocation = function(){
     
        
        //load Current drop down selection using the onboard service  
        $scope.dropdownCurrentLabelOnboard=onboard.getCurrentLabel();
//        console.log(" $scope.dropdownCurrentLabelOnboard", $scope.dropdownCurrentLabelOnboard);
        var url = $location.url(),
            locationQuery = $location.search();
           
             //check if we should filter (
             //only if location is present)
                if(locationQuery.catID!=null){
                   var categoryID =locationQuery.catID;
                   var categoryName =locationQuery.cat;
//                   console.log('Filtering',categoryID);
                    //set the dropdown
                    $scope.dropdownCurrentLabel=categoryName;
                    
               
                   
                    // $scope.dropdownCurrentLabelEn=[Entertainment, movie,audio ];
                    var filteredMovies;
                    if(categoryID == movieAllFilter){
                        //only sort A-Z
                            filteredMovies =  $filter('orderBy')(allMovies, 'contentMeta.title');                                            
                    } else {
                        //filter
                             filteredMovies = _.filter(allMovies, function(item){                                 
                             return item.categoryID==categoryID;
                            });
                    }
                    
//                  This script controls the pagination
                    var pagesShown = 1;
                    var pageSize = 100; 
                    
//                    If statement check to see if allcontent items are loaded
//                    if true the show more button is hidden
                      
//                      if( $scope.movies.length < 20){
//                          
//                          console.log("$scope.movies.length " + $scope.movies.length );
//                          $scope.showMoreButton= true;
//                          
//                      }else{
//                             $scope.showMoreButton= true;
//                          
//                      }
//                  
                       
                    $scope.movies = filteredMovies;
                   
                    $scope.itemsLimit = function() {
                        return pageSize * pagesShown;
                    };
                    $scope.hasMoreItemsToShow = function() {
                           return pagesShown < ($scope.movies.length / pageSize);
                       
                    };
                    $scope.showMoreItems = function() {
                        pagesShown = pagesShown + 1;  
                      
                      
                    };  
                }
            }; //End of Filter by location 
            
         
         
        var setGenre = function (genreData) {
        var currentGenre = selector.getGenre(genreData);
      };
            
     micrositeApi.getAllContentItemsByType("movies").then(setGenre);


    //Note: The code below contain 3 different 
    //ways the default movies can be loaded 
    //This includes BY 
    //(1)ALPHABETICAL/
    //(2)NEW RELEASE/
    //(3)ALPHABETICAL With NEW RELEASE First/
    
    
     var onSuccess = function (data) {
       allMovies = data;

       
//     (1)ALPHABETICAL/       
//      console.log('allMovies'+ allMovies);
//      $scope.movies = $filter('orderBy')(selector.filterContentForSelectedFlight(data), 'contentMeta.genre');

//     (2)NEW RELEASE/
//        var defaultMovie = _.filter(data, function(item) {
//                          return item.categoryID == "632";});
//                          $scope.movies = defaultMovie; 
//      $scope.custom_sort= "custom"    
//      
//      
//      
        //(3)ALPHABETICAL With NEW RELEASE First/ 
       var filteredMoviesA = _.filter(allMovies, function(item){
                             return item.categoryID == movieNewRelease;
                            }); 
//                            filteredMoviesA.reverse();
           
       var filteredMoviesB = _.filter(allMovies, function(item){
                             return item.categoryID != movieNewRelease;
                            });    
           
       var filterConcat = filteredMoviesA.concat(filteredMoviesB);
     
       
         
        // The Script below controls the pagination 
                var pagesShown = 1;
                var pageSize = 100;                    
                $scope.movies= filterConcat;
                var  getPageShownStoreMovie = window.localStorage.getItem("ShownPageStore");     
                      
                      if (getPageShownStoreMovie > 1){
                          pagesShown = getPageShownStoreMovie;
                         }
                   
//                     console.log("$scope movies",$scope);
//                     console.log("main movies",$scope.movies);
                    $scope.itemsLimit = function() {
                    
                      
                        window.localStorage.setItem("ShownPageStore", pagesShown);  
                        
                    
                        
                    
                       return pageSize * pagesShown;                                                  
                    };
                    $scope.hasMoreItemsToShow = function() {
                         console.log( " pagesShown:  " + pagesShown + " $scope.movies.length:  " + $scope.movies.length +  "pageSize:  "+ pageSize);
                         
//                        
                         
                         
                        return pagesShown < ($scope.movies.length / pageSize);
                      
                    };
                      console.log("pagesShown" + pagesShown);
                    $scope.showMoreItems = function() {
//                         console.log("Show More items " );
                           pagesShown = pagesShown + 1;  
                    };
                    
                    
        //filter results if flight is selected on route selector page
        filterResultsByLocation();
         
    } ;
    //api call to get all movies
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("movies").then(onSuccess);
    
    //get all categories then filter by Parent category name 
    micrositeApi.getAllCategories().then(function(data){
        //get all child categories of the category ID 985 (Movies)
       var categories = micrositeApi.getAllSubcategoriesOfParentCategory(data, movieCat);
       $scope.dropdownCategories = categories;
//        console.log('Sub Categories:', categories);
        
    });
    

        //want to know whenever $location changes
        $rootScope.$on('$locationChangeSuccess', function(event){
            console.log("locationChangeSuccess FIRED");
         filterResultsByLocation();
        });

    //filter by category
    $scope.filterByDropdownCategory = function(categoryID,categoryName){
        // set category in URL
        $location.search('catID', categoryID);
        $location.search('cat', categoryName);
        
//         console.log('categoryID'+ categoryID);
//         console.log('categoryName'+ categoryName);
         

        

        $scope.dropdownCurrentLabel=categoryName;
        
        var filteredMovies;
        
        if(categoryID == movieAllFilter){
            //only sort A-Z            
                filteredMovies =  $filter('orderBy')(allMovies, 'contentMeta.title');                
        } else {
            //filter
             filteredMovies = _.filter(allMovies, function(item){
             return item.categoryID==categoryID;
           });    
        }
        $scope.movies=filteredMovies;     
    };
    
    
    
    
    //The section below handles the details page 
 }).controller('MovieCtrl', function($scope, $stateParams, $state, $translate, micrositeApi,selector, $cookieStore){
     var movieTitle = $stateParams.id;
//   console.log('MovieTile =' + movieTitle);

    
     var onSuccess = function (data) {
            //Selects the movie you click on and movie info in the movie variable 
            var movie = _.filter(data, function(item) {
//                return item.contentMeta.title == $stateParams.id;
                 return item.id == $stateParams.id;
                 
                 
            });
            
//                 This script allow you to filter
//                  specific translations
//                 that have been ommitted in the back end(genres)
//                 using the key values
                  
    
            
             var selectGenre = movie[0].contentMeta.genre;
              var selectGenreRes  = selectGenre.toLowerCase();
//             console.log("selectGenre " + selectGenre );
           
           
               var getLangRes = function(resource){
                
                 var resourceInvert=_.invert(resource) ;
               
               
                 
                 var currentLangRes = _.filter(resourceInvert, function(item) {
                   
                 return item === selectGenreRes;
                });       
                
                 var result = currentLangRes;
                 $scope.genreTranslate =  result[0]  ;
                 
                 
                 
           };
            var resourceLang= $cookieStore.get('langKey');
            micrositeApi.getAllLanguageResources(resourceLang).then(getLangRes);
                         
     
    ////////////////////
      
      
            
            //The following code is used to create the recommendation list 
            
            //
            var currentGenre = movie[0].contentMeta.genre;
            //The movie id is used later to exclude the current movie from the recommended list
            var currentid = movie[0].id; 
            
            var filteredMoviesRec = _.filter(data, function(itemGenre){
//                                  console.log("itemGenre"+itemGenre.contentMeta.genre);
                                  return itemGenre.contentMeta.genre===currentGenre;
                              });
                      
                         //Is empty function removes the recommendation panel if no recommendations are present
                         $scope.isEmpty = function (obj) {
                                    for (var i in obj) if (obj.hasOwnProperty(i)) return false;
                                    return true;
                                    };
                            
             $scope.filteredMoviesRec =  _.without(filteredMoviesRec, _.findWhere(filteredMoviesRec, {id:currentid }));
                    
            //get the first element in array
            $scope.movie= movie[0];
            $scope.movies = _.shuffle(selector.filterContentForSelectedFlight(data));
           
     };
    //api call to get all moveis
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("movies").then(onSuccess);
    
  
    
    //TODO
    $scope.viewMovie = function(){
        $state.go('app.playmovie', { id: $scope.movie.id });  
    };
}).controller('ActionCtrl',  function($scope, $rootScope, $stateParams,   media , $state, $sce) {
 
  
//  Isolation scope that controls
//  the modal
    $scope.modalShown = false;
    $scope.toggleModal = function() {
     console.log("toggleModal");
    $scope.modalShown = !$scope.modalShown;
    
//  Refresh state function is a temperary fix 
//  to the video continuing to play after modal close
//    $scope.refreshState = function(){
//    console.log("refreshState");
//    $state.forceReload();
//    };
    
    
    
    
    //The movies are loaded here
     var meta ;
     var movieTitle = $stateParams.id;
         media.getMovie(movieTitle).then(function(data){
//          resolve("Success!");
        meta =data;
        console.log(" meta ", meta );
 
        $scope.item = meta.metadata;
        console.log('$scope.item',$scope.item);
        $scope.hidenav = function(){
    return $scope.item.type === 'audio';
  };
  //$scope.vid = $rootScope.mediaPath + $scope.item.media.source;
  //$scope.vid =meta.metadata.media[0].source;//mp4

  $scope.onPlayerReady = function(){

  };

  $scope.onCompleteVideo = function(){

  };

  $scope.onUpdateTime = function(){

  };

  $scope.onUpdateVolume = function(){

  };

  $scope.onUpdateState = function(){
      
      

  };

  var stretchModes = [
    {label: "None", value: "none"},
    {label: "Fit", value: "fit"},
    {label: "Fill", value: "fill"}
  ];

  var playerStretchMode = stretchModes[1];
  var playerAutoPlay = true;
  var playerPlugins = {};

  if($scope.item.type === 'audio') {
      console.log('Audio album details', media);
    playerStretchMode = stretchModes[1];
    var playerPlugins = {
      //still: { url: media.contentMeta.audio_poster_300_300 },
      poster: { url: media.contentMeta.audio_poster_600_600 }
    };
    
  }
    
 //define sources 
    var allSources=[];
    if($scope.item.type === 'movie' || $scope.item.type === 'tv') {
        console.log('Playback', meta.metadata);
        if(meta.metadata.media[0] != null ){
            var video_1 = {src:  meta.metadata.media[0].source, type: meta.metadata.media[0].type};
            allSources.push(video_1);
        }
        if(meta.metadata.media[1] != null){
            var video_2 = {src: meta.metadata.media[1].source, type: meta.metadata.media[1].type};
            allSources.push(video_2);
        }
        if(meta.metadata.media[2] !=null ){
            var video_3 = {src: meta.metadata.media[2].source, type: meta.metadata.media[2].type};
            allSources.push(video_3);
        }
    }
     if($scope.item.type === 'audio' ) {
           var audio_mp3 = {src: meta.metadata.media[0].source, type: meta.metadata.media[0].type};
            allSources.push(audio_mp3);
     }

    //console.log('allSources',allSources);

  $scope.config = {
    autoPlay: playerAutoPlay,
    autoHide: true,
    responsive: true,
    transclude: true,
    //theme: { url: 'bower_components/videogular-themes-default/videogular.css' },
    theme:{url: 'styles/utility/videogular/videogular.css'},
    sources: allSources,
    onVgToggleFullscreen: true,
    stretch: playerStretchMode,
    plugins: playerPlugins
  };
  });
};
  
});

}());