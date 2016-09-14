
'use strict';
angular.module('inflightApp.tv', [
    
      'themeConfig'
])
.config(function($stateProvider,data){
    
  var theme = data;
  $stateProvider
    .state('app.tvs', {
      url: '/tv',
      abstract: true,
      views: {
        'main': {
          template: '<div ui-view></div>'
        }
      }
    })
    .state('app.tvs.list', {
      url: '',
      controller: 'TvsCtrl',
      templateUrl: 'scripts/modules/inflight/tv/views/tv.tpl.html',
      data: { title: '_tv' }
    })
    .state('app.tvs.tv', {
      url: '/details/:id',
      controller: 'TvCtrl',
      templateUrl: 'scripts/modules/templates/' + theme + '/tmpl_details/tv-detail.tpl.html',
      data: { title: '_tv' }
    });
})
.controller('TvsCtrl', function($scope,$rootScope, $filter,
                                 micrositeApi,$translate,$location, 
                                 $window, selector,onboard, 
                                 tvCat, tvAll,$state){

    $translate('_tv').then(function (translatedValue) { $scope.contentTile = translatedValue;});// Page Title with Translate function
    $scope.query={term:''};//Handles Tv Search Option  Scope
    
     var allTVs;
     $scope.slider = { 
         setSliderFolder: "tv",
         slide_01: "slider_tv.jpg"
    };//Set Slider Information 
     
 
    
    // FIRST PAGE LOAD    
    var onSuccess = function (data) {
         //filter results if flight is selected on route selector page
         allTVs = selector.filterContentForSelectedFlight(data);
               //   This script controls the pagination
                    var pagesShown = 1;
                    var pageSize = 200;    
                    
                    var  getPageShownStoreTv = window.localStorage.getItem("ShownPageStoreTv");     
                      
                      if (getPageShownStoreTv > 1){
                          pagesShown = getPageShownStoreTv;
                         }
                    $scope.tvs = $filter('orderBy')(selector.filterContentForSelectedFlight(data), 'contentMeta.tv_title');
                   
                    $scope.itemsLimit = function() {
                        
                        window.localStorage.setItem("ShownPageStoreTv", pagesShown);  
                        return pageSize * pagesShown;
                    };
                    $scope.hasMoreItemsToShow = function() {
                        return pagesShown < ($scope.tvs.length / pageSize);
                    };
                    $scope.showMoreItems = function() {
                        pagesShown = pagesShown + 1;         
                    };
       
        filterResultsByLocation();// Runs the filterResults by Location 
        
    };
    //api call to get all tv items
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("tv").then(onSuccess);  
    
    //END FIRST PAGE LOAD 
    
    
    //filterResultsByLocation Function Filter By URL (Main Navigation/Back Button  )
    var filterResultsByLocation = function(){
         $scope.dropdownCurrentLabelOnboard=onboard.getCurrentLabel();
        var url = $location.url(),
            locationQuery = $location.search();

               //CHECKS if  filter is  by  Location (only if location(CATID) is present)
                if (locationQuery.catID !== undefined){

                    var categoryID =locationQuery.catID;
                    var categoryName =locationQuery.cat;



                    //SET the dropdown Names
                    $scope.dropdownCurrentLabel=categoryName;
                    $scope.dropdownCurrentLabelOnboard=onboard.getCurrentLabel();
                    
                    var filteredItems;//filter Declared
                    
                    //CHECK IF ALL has been selected (All Is Filtered alphabetically )
                    if(categoryID == tvAll){
                        //only sort A-Z All Filter 
                        filteredItems =  $filter('orderBy')(allTVs, 'contentMeta.tv_title');
                     // IF its not ALL filter by Category  
                    } else {
                        //filter
                        filteredItems = _.filter(allTVs, function(item){
                            
                          
                             return item.categoryID == categoryID;
                        });
                    }
                 // Pagination
                    var pagesShown = 1;
                    var pageSize = 200;                    
                    $scope.tvs=filteredItems;
                    
//                     console.log("$scope.tvs" + $scope.tvs);
                   
                    $scope.itemsLimit = function() {
                        return pageSize * pagesShown;
                    };
                    $scope.hasMoreItemsToShow = function() {
                        return pagesShown < ($scope.tvs.length / pageSize);
                    };
                    $scope.showMoreItems = function() {
                        pagesShown = pagesShown + 1;         
                    };
            } //filterResultsByLocation End       
                  
    };





    //START OF DROP DOWN CAT
    //init translate for default Filter 
    $translate('_filter')
        .then(function (translatedValue) {
            $scope.dropdownCurrentLabel = translatedValue;
        });
      //Set   
    $scope.currentlabelDropdownOnboard = onboard.getOnboardList();
        
     $scope.filterByDropdownCategoryOnboard = function(onboardID,onboardName){
        // set category in URL
          onboard.setCurrentLabel(onboardID,onboardName);  
    };
    
    //get all categories then filter by Parent category name
    micrositeApi.getAllCategories().then(function(data){
        //get all child categories of the category ID 986 (TVs)
       var categories= micrositeApi.getAllSubcategoriesOfParentCategory(data, tvCat);
       $scope.dropdownCategories = categories;
        //console.log('Sub Categories:', categories);
    });
    //END OF DROP DOWN CAT






    //FILTER by Catagoy Dropdown 
    $scope.filterByDropdownCategory = function(categoryID,categoryName){
        // set category in URL
        $location.search('catID', categoryID);
        $location.search('cat', categoryName);

        $scope.dropdownCurrentLabel=categoryName;
        var filteredItems;
        //CHECKS if the filter is all ( Filter Alphabetically)
        var tvAllint = parseInt(tvAll);
        if(categoryID === tvAllint){
            //only sort A-Z
             filteredItems =  $filter('orderBy')(allTVs, 'contentMeta.tv_title');
             console.log("filteredItems" , filteredItems);
        //IF not filter By Catgegory 
        } else {
            //filter
                 filteredItems = _.filter(allTVs, function(item){
                 return item.categoryID===categoryID;
                });
               }   
             // Pagination Start
                    var pagesShown = 1;
                    var pageSize = 200;      
                    $scope.tvs=filteredItems;
                    $scope.itemsLimit = function() {
                    window.localStorage.setItem("ShownPageStoreTv", pagesShown);
                        return pageSize * pagesShown;
                    };
                    $scope.hasMoreItemsToShow = function() {
                        return pagesShown < ($scope.tvs.length / pageSize);
                    };
                    $scope.showMoreItems = function() {
                        pagesShown = pagesShown + 1;    
                    }; // Pagination End
           
    };//FILTER by Catagoy Dropdown  End
})


.controller('TvCtrl', function($scope, $stateParams, $state, micrositeApi,$cookieStore, $filter){
        var title = $stateParams.id;
        var _allEpisodes;
        var _allTv;

    var onSuccess = function(data){
        console.log('tv',data);
        _allEpisodes = data.episodes;
        _allTv = data.tv;
        
        $scope.numberOfEpisodes=data.episodes.length;
        $scope.numberOfSeasons=data.tv.contentMeta.tv_number_of_seasons;
        
        //tv details
         $scope.tv= data.tv;
         
                              
//                 This script allow you to filter
//                  specific translations
//                 that have been ommitted in the back end(genres)
//                 using the key values
                  
    
            
             var selectGenre = _allTv.contentMeta.tv_genre;
              var selectGenreRes  = selectGenre.toLowerCase().trim();
           
           
           
               var getLangRes = function(resource){
            
                 var resourceInvert=_.invert(resource) ;
                 var test = resource;
            
                 
                 var currentLangRes = _.filter(resourceInvert, function(item) {
                   
                 return item === selectGenreRes;
               
                });       
                
                 var result = currentLangRes;
                 $scope.genreTranslate =  result[0]  ;
         
                 
                 
           };
            var resourceLang= $cookieStore.get('langKey');
            micrositeApi.getAllLanguageResources(resourceLang).then(getLangRes);
                         
     
    ////////////////////
              
        
         //get all seasons
        var seasons = [];
        _.each(data.episodes, function(item){
            seasons.push(item.contentMeta.episode_season);
        }); 
        seasons = _.uniq(seasons);
        $scope.seasons = seasons;
        //console.log('TV seasons:', $scope.seasons);
        
         //get first found season
         $scope.selectedSeason = seasons[0];
        
        //filter episodes by season
//         $scope.episodes = _.filter(data.episodes, function(item){
//            return item.contentMeta.episode_season==  $scope.selectedSeason;
//        })     
        
                     
          //filter multipule episodes by season
         $scope.episodes =$filter('filter')(data.episodes, function(value, index, array){
             if($scope.selectedSeason.indexOf(value.contentMeta.episode_season)>-1) {
                 return true;
             }
        });
        
        
      
        //get first episode in selected season
       $scope.selectedEpisode = _.find(data.episodes, function (item) { return item.contentMeta.episode_season == $scope.selectedSeason });
    
    };
    micrositeApi.getTVById(title).then(onSuccess);
   
    
    //season change
    $scope.chooseSeason = function(season){
//        console.log('$scope.chooseSeason'+$scope.chooseSeason);
//        console.log('Changing TV season: ' + season);
//        console.log('Filtering TV episodes ', _allEpisodes);
        //selected season
         $scope.selectedSeason = season;
        //filter episodes by season
        $scope.episodes  = _.filter(_allEpisodes, function(item){
            return item.contentMeta.episode_season===season;
        }) 
    };
    
    //view
    //#/player/tv/The Big Bang Theory DE/Season 8/22
    $scope.viewMedia = function(){
        console.log('Opening TV player : ' + $scope.tv.contentMeta.tv_title + " , Season: " + $scope.selectedSeason + ", Number: " + $scope.selectedEpisode.contentMeta.episode_number);
    $state.go('app.playtv',  { id: $scope.tv.contentMeta.tv_title,
                               season: $scope.selectedSeason,
                               episode: $scope.selectedEpisode.contentMeta.episode_number
                             });
  };
    


  $scope.isEpisodeShown = function($index){
    //$scope.selectedEpisode = $scope.selectedSeason.episodes[$index];
  };

});




