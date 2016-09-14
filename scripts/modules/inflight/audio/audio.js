(function () {

'use strict';

angular.module('inflightApp.audio', [
      'themeConfig'
])
    .config(function ($stateProvider,data) {
        
        
         var theme = data;
        $stateProvider
            .state('app.audios', {
                url: '/',
                abstract: true,
                views: {
                    'main': {
                        template: '<div ui-view></div>'
                    }
                }
            })
            .state('app.audios.list', {
                url: 'audio',
                cache: false,
                controller: 'AudiosCtrl',
                templateUrl: 'scripts/modules/inflight/audio/views/audio.tpl.html',
                data: {
                    title: 'menu_inflight_audio'
                }
            })
            .state('app.audios.audio', {
                url: 'audio/details/:id',
                controller: 'AudioCtrl',
                templateUrl: 'scripts/modules/templates/'  + theme + '/tmpl_details/audio-detail.tpl.html',
                data: {
                    title: 'menu_inflight_audio'
                }
            });
    })
    .controller('AudiosCtrl', function ($scope, $rootScope, $filter, micrositeApi, $translate, $location, $window ,selector, onboard ,audioCat,audioAll) {
        //     Sets Page title
        $translate('_audio').then(function (translatedValue) { $scope.contentTile = translatedValue;});
        $scope.query={term:''};
        
         $scope.slider = { 
         setSliderFolder: "audio",
         slide_01: "slider_audio.jpg"
    };
     

         

        var allAlbums;

        //init translate
        $translate('_filter')
            .then(function (translatedValue) {
                $scope.dropdownCurrentLabel = translatedValue;
            });
        $scope.currentlabelDropdownOnboard = onboard.getOnboardList();   
              
            
    //  First Filter on page load 
        var onSuccess = function (data) {
             //filter results if flight is selected on route selector page
                allAlbums = selector.filterContentForSelectedFlight(data);    
                // The Script below controls the pagination 
                var pagesShown = 1;
                var pageSize = 100;     
                
                 $scope.audios = $filter('orderBy')(selector.filterContentForSelectedFlight(data), 'contentMeta.audio_title');                  
                 
//                  The code below is only used for the ram client 
//                  and the code above is cancelled  
//                  
//                    $scope.audios = _.filter(allAlbums, function (item) {
//                    return item.categoryID === 804;
//                    });
                                  
                    $scope.itemsLimit = function() {
                        return pageSize * pagesShown;
                    };
                    $scope.hasMoreItemsToShow = function() {
                        return pagesShown < ($scope.audios.length / pageSize);
                    };
                    $scope.showMoreItems = function() {
                       
                        pagesShown = pagesShown + 1;         
                    };      
                    
                    filterResultsByLocation();
               
          
        };  
         //api call to get all Audio Albums
        micrositeApi.getAllContentItemsByType("audio").then(onSuccess);
        
        
            
                
   
        
    $scope.filterByDropdownCategoryOnboard = function(onboardID,onboardName){
        // set category in URL
//         console.log('onboardID'+ onboardID);
//         console.log('onboardName'+ onboardName);
           onboard.setCurrentLabel(onboardID,onboardName);
         
          //init translate
//          $translate('_filter')
//        .then(function (translatedValue) {
//            $scope.dropdownCurrentLabelOnboard= translatedValue;
//            console.log(" DropDown translatedValue" + translatedValue);
//        }); 
//        

        
     }   


        //Secondary Filter results by location search parameters
        var filterResultsByLocation = function () {
            
            $scope.dropdownCurrentLabelOnboard=onboard.getCurrentLabel();
                     
            var url = $location.url(),
                locationQuery = $location.search();

            //check if we should filter (only if location is present)

            if (locationQuery.catID != null) {

                var categoryID = locationQuery.catID;
                var categoryName = locationQuery.cat;

                console.log('categoryName', categoryName);
                console.log('Filtering', categoryID);
                console.log('audioAll', audioAll);
                //set the dropdown
                $scope.dropdownCurrentLabel = categoryName;
                //filter
                var filteredItems;
                

                if (categoryID == audioAll) {
                    //only sort A-Z
                    filteredItems = $filter('orderBy')(allAlbums, 'contentMeta.audio_title');
                } else {
                    //filter
                    filteredItems = _.filter(allAlbums, function (item) {
                        return item.categoryID == categoryID;
                    });
                }
                        $scope.audios=filteredItems;
                        console.log("$scope.audio" ,$scope.audio);
                }     
                
        };

        //get all categories then filter by Parent category name
        micrositeApi.getAllCategories().then(function (data) {
            //get all child categories of the category ID 987 (Audios)
            var categories = micrositeApi.getAllSubcategoriesOfParentCategory(data, audioCat);
            $scope.dropdownCategories = categories;
            //console.log('Sub Categories:', categories);
        });


        //want to know whenever $location changes
        $rootScope.$on('$locationChangeSuccess', function (event) {
            filterResultsByLocation();
        });


        //filter by category
        $scope.filterByDropdownCategory = function (categoryID, categoryName) {

            // set category in URL
            $location.search('catID', categoryID);
            $location.search('cat', categoryName);

            $scope.dropdownCurrentLabel = categoryName;
            var filteredItems;


       

            if (categoryName === audioAll) {

                //only sort A-Z
                filteredItems = $filter('orderBy')(allAlbums, 'contentMeta.audio_title');
            } else {
                //filter
                filteredItems = _.filter(allAlbums, function (item) {
                    return item.categoryID == categoryID;
                });
            }
                                     
                        $scope.audio=filteredItems;
                     };
                   
              
       
    }).controller('AudioCtrl', function ($scope, $stateParams, $state, micrositeApi) {     
           
        var title = $stateParams.id;
        console.log("$stateParams.id=" + $stateParams.id);
        
       
        var onSuccess = function (data) {
                $scope.audio = data.audio;
                $scope.tracks = data.tracks;
                   
                 //Stephen  
                //Checks if there are any MP3 Audio Files present 
                   $scope.trackChecker = function (){
                      
                      $scope.songs = data.tracks; 
                    
                    var tracksize = _.size($scope.songs); 
                    var mp3Result =[];
                    for( i=0; i < tracksize; i++ ){
                       mp3Result.push($scope.songs[i].contentMeta.track_media);
                    }
                    
                    console.log( "TIMEDATE"+ mp3Result);
 
                    var checkValueOfMp3 = mp3Result;
                      
                    function NoneEmpty() {
                    
                    var item =checkValueOfMp3;
                    for(var y=0; y < item.length ; y++) {
                    if(checkValueOfMp3[y] !=='') 
                        
                         return true;
                         }
                         return false; 
                         }
                        var hasAudio= NoneEmpty();
                         console.log("ARTIST HAS MP3 FILES :"+ hasAudio );
                         
                       return hasAudio;   
                         
                   };   
                   
                   
                   $scope.aa  = $scope.trackChecker();
               
                   console.log("has Audio " +  $scope.aa );
                
                
               
                var firstTrackWithMp3 = _.find(data.tracks, function (item) {
                    return item.contentMeta.track_media !== null && item.contentMeta.track_media !== '';
                });
                $scope.selectedTrack = firstTrackWithMp3; //$scope.tracks[0];

                //time calsulations
                var total_seconds = 0;

                for (var i = 0; i < $scope.tracks.length; i++) {
                    var track = $scope.tracks[i];
                    //String to Seconds
                    var hms = track.contentMeta.track_duration; //'02:04:33';   // your input string
                    var a = hms.split(':'); // split it at the colons

                    // minutes are worth 60 seconds. Hours are worth 60 minutes.
                    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
                    console.log('Track Seconds:', seconds);
                    total_seconds += seconds;
                }
                console.log('Total Seconds: ', total_seconds);

                //Seconds to hh:mm
                var totalTrackDuration = function (_totalSeconds) {
                    var sec_num = parseInt(_totalSeconds, 10); // don't forget the second param
                    var hours = Math.floor(sec_num / 3600);
                    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                    var seconds = sec_num - (hours * 3600) - (minutes * 60);

                    //    if (hours   < 10) {hours   = "0"+hours;}
                    //    if (minutes < 10) {minutes = "0"+minutes;}
                    //    if (seconds < 10) {seconds = "0"+seconds;}
                    var time = hours + 'h ' + minutes + 'min';
                    if (hours < 1) {
                        time = minutes + 'min';
                    }

                    return time;
                };

                $scope.totalTrackDuration = totalTrackDuration(total_seconds);
            };
            //Get a single Audio album by title, including all Audio Tracks
        micrositeApi.getAudioAlbumById(title).then(onSuccess);


        //PLay Media
        $scope.playMedia = function (track) {
            //console.log("track=" + track);
            //$scope.selectedTrack = track;
            //console.log("track=" +   $scope.selectedTrack);
            $state.go('app.playaudio', {
                id: track.contentMeta.track_title,
                album: $scope.audio.contentMeta.audio_title
            });
        };

    });
}());