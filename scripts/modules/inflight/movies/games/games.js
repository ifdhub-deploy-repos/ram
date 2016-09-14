(function () {
   'use strict';
angular.module('inflightApp.games', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.games', {
                abstract: true,
                url: '/games',
                views: {
                    'main': {
                        template: '<div ui-view></div>'
                    }
                }
            })
            .state('app.games.list', {
                url: '',
                controller: 'GamesCtrl',
                templateUrl: 'scripts/modules/inflight/games/games.tpl.html',
                data: {
                    title: 'menu_inflight_games'
                }
            })
            .state('app.games.game', {
                url: '/games/:id',
                controller: 'GameCtrl',
                data: {
                    title: 'menu_inflight_games'
                },
                templateUrl: 'scripts/modules/inflight/games/game.tpl.html'

                //      resolve: {
                //        game:  function($http, $stateParams){
                //          return $http({method: 'GET', url: '/api/game/' +  $stateParams.id});
                //        }
                //      }
            })
            .state('app.games.player', {
                url: '/gamesplayer/:id',
                data: {
                    title: 'menu_inflight_games'
                },
                controller: 'GamePlayerCtrl',
                templateUrl: 'scripts/modules/inflight/games/game-detail.tpl.html'
                    //      resolve: {
                    //        game:  function($http, $stateParams){
                    //          return $http({method: 'GET', url: '/api/game/' +  $stateParams.id});
                    //        }
                    //      }
            });
    })

.controller('GamesCtrl', function ($scope, $rootScope, $filter, micrositeApi, $translate, $location, $window,selector) {


    var allGames;

    //init translate
    $translate('application_filter')
        .then(function (translatedValue) {
            $scope.dropdownCurrentLabel = translatedValue;
        });


    //Filter results by location search parameters
    var filterResultsByLocation = function () {
        var url = $location.url(),
            locationQuery = $location.search();

        //check if we should filter (only if location is present)

        if (locationQuery.catID !== null) {

            var categoryID = locationQuery.catID;
            var categoryName = locationQuery.cat;


            console.log('Filtering', categoryID);
            //set the dropdown
            $scope.dropdownCurrentLabel = categoryName;
            //filter
            var filteredItems;

            if (categoryID === '0') {
                //only sort A-Z
                filteredItems = $filter('orderBy')(allGames, 'contentMeta.game_name');
            } else {
                //filter
                filteredItems = _.filter(allGames, function (item) {
                    return item.categoryID == categoryID;
                });
            }



            $scope.games = filteredItems;
        }
    };



    var onSuccess = function (data) {
        //filter results if flight is selected on route selector page
                allGames = selector.filterContentForSelectedFlight(data);
            $scope.games = $filter('orderBy')(selector.filterContentForSelectedFlight(data), 'contentMeta.game_name');
            filterResultsByLocation();
        };
        //api call to get all games
        //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("game").then(onSuccess);



    //get all categories then filter by Parent category name
    micrositeApi.getAllCategories().then(function (data) {
        //get all child categories of the category ID 83 (Games)
        var categories = micrositeApi.getAllSubcategoriesOfParentCategory(data, 83);
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

        if (categoryName === 'A-Z') {
            //only sort A-Z
            filteredItems = $filter('orderBy')(allGames, 'contentMeta.game_name');
        } else {
            //filter
            filteredItems = _.filter(allGames, function (item) {
                return item.categoryID == categoryID;
            });
        }
        $scope.games = filteredItems;

    };




})

.controller('GameCtrl', function ($scope, $stateParams, micrositeApi) {

    var onSuccess = function (data) {
            var game = _.filter(data, function (item) {
                return item.contentMeta.game_code == $stateParams.id;
            });
            $scope.game = game[0];
        };
        //api call to get all games
        //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("game").then(onSuccess);

})

.controller('GamePlayerCtrl', function ($scope, $stateParams, micrositeApi) {

    //$scope.game = game.data;
    var onSuccess = function (data) {
            var game = _.filter(data, function (item) {
                return item.contentMeta.game_code == $stateParams.id;
            });
            $scope.game = game[0];
        };
        //api call to get all games
        //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("game").then(onSuccess);

    // #democode
    $scope.showIframe = false;

    setTimeout(function () {
        $scope.showIframe = true;
        $scope.$apply();
    }, 5000);

});

}());