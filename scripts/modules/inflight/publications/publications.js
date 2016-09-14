(function () {
//Stephen: The publication controllers and view are set to domonstrate how the filtering works. You could alternatively filter in the View using the 'filter' directive or create a custom filter.
'use strict';
angular.module('inflightApp.publications', [])
.config(function($stateProvider){
  $stateProvider
	  .state('app.publications', {
	    url: '/publications',
      abstract: true,
	    views: {
	      'main': {
	        template: '<div ui-view></div>'
	      }
	    }
	  })
    .state('app.publications.list', {
      url: '',
      templateUrl: 'scripts/modules/inflight/publications/views/publications.tpl.html',
      controller: 'PublicationsCtrl',
      data: { title: 'menu_inflight_publications' }
    })
	  .state('app.publications.publication', {
	    url: '/publications/:id',
	    controller: 'PublicationCtrl',
        data: { title: 'menu_inflight_publications' },
	    templateUrl: 'scripts/modules/inflight/publications/views/publications-detail.tpl.html'
	  });
})


.controller('PublicationsCtrl', function($scope, $rootScope, $filter, micrositeApi, $translate, $location, $window,selector){
 
var allPublications;

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
                filteredItems = $filter('orderBy')(allPublications, 'contentMeta.publication_title');
            } else {
                //filter
                filteredItems = _.filter(allPublications, function (item) {
                    return item.categoryID === categoryID;
                });
            }



            $scope.publications = filteredItems;
        }
    };


     var onSuccess = function (data) {
         //filter results if flight is selected on route selector page
                allPublications = selector.filterContentForSelectedFlight(data);
            $scope.publications = $filter('orderBy')(selector.filterContentForSelectedFlight(data), 'contentMeta.publication_title');
            filterResultsByLocation();
        };
        //api call to get all publications
        //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("publication").then(onSuccess);
    
    
    

    
    //get all categories then filter by Parent category name
    micrositeApi.getAllCategories().then(function (data) {
        //get all child categories of the category ID 84 (Publications)
        var categories = micrositeApi.getAllSubcategoriesOfParentCategory(data, 84);
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
            filteredItems = $filter('orderBy')(allPublications, 'contentMeta.publication_title');
        } else {
            //filter
            filteredItems = _.filter(allPublications, function (item) {
                return item.categoryID === categoryID;
            });
        }
        $scope.publications = filteredItems;

    };



    
})

//pubication details
.controller('PublicationCtrl', function($scope, $stateParams, $http, $rootScope, $state,  $translate, micrositeApi){
  var publicationTitle = $stateParams.id;
    
    var onSuccess = function (data) {
          var publication = _.filter(data, function(item) {return item.contentMeta.publication_title === publicationTitle;});
          $scope.publication = publication[0];
    };
    //api call to get single publication
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("publication").then(onSuccess);


});
}());