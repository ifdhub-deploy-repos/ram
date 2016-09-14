'use strict';

        
        

//Microsite API URL
//The API URL must include the API key
//more,help, doc: http://micrositeifd.azurewebsites.net/
//This global variables will be available on
//if (_.isUndefined(global_API_base_url)) {
//    console.log('Setting API_base_url');
//  // var global_API_base_url = 'http://microsite-cms.ifdgui.com/api/v1/f231ad67-b10e-41ae-91c0-7af9823d0c3e';
//  
//     var global_API_base_url = 'http://micrositeifd.azurewebsites.net/api/v1/9d368586-8a8a-4d26-934d-4096d7e17ce4';   
//     
//}
//if (_.isUndefined(global_API_default_language_id)) {   var global_API_base_url = 'http://microsite-cms.ifdgui.com/api/v1/f231ad67-b10e-41ae-91c0-7af9823d0c3e';
//if (_.isUndefined(global_API_default_language_id)) {   var global_API_base_url = 'http://micrositeifd.azurewebsites.net/api/v1/9d368586-8a8a-4d26-934d-4096d7e17ce4';
//    console.log('Setting API_default_language_id');
//    var global_API_default_language_id = 130;//English
//}

if (_.isUndefined(global_API_default_language_code)) {
//    console.log('Setting API_default_language_code');
    var global_API_default_language_code = 'en';  //English
}


var inflightApp = angular.module('inflightApp', [
  //'ionic',
  'ngResource',
  'ui.router',
  'ngAnimate',
  'ngCookies',
  'nas.brand',
  //'ngMockE2E',
  "themeConfig",
  'inflightApp.helperdirectives',
  'inflightApp.jcarouselec',
  'inflightApp.jcarouselbus',
  'inflightApp.menu', 
  'inflightApp.preview',
  'inflightApp.actionmodal',
//  'inflightApp.svgdirective',
  //kamil's services
  //common API service
  'services.micrositeApi',
  'services.themeServices',
  'services.onboard',
  'foundationDemoApp',
  //flight selector filters
  'services.selector',
  //image preloader
  'services.preloader',
  'services.menu', 
 

//     'inflightApp.gulpVariable',
  'pascalprecht.translate',
  'inflightApp.inflight',
  'inflightApp.home',
  'themeConfig',
  'inflightApp.player',
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.buffering",
  "com.2fdevs.videogular.plugins.poster",
 

//  'inflightApp.wifi',"
  'inflightApp.onboardec'

]).run(
        
   //Stephens Code: This function needs to run from the start so that the  page titles can be loaded into the states     
  [           '$rootScope', '$state', '$stateParams','$templateCache','selector', 'data',
    function (  $rootScope,   $state,   $stateParams, $templateCache, selector,  data) {
 
    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
    // to active whenever 'contacts.list' or one of its decendents is active.
      
    
    
       $rootScope.$state = $state;
       console.log("$rootScope.$state" ,$rootScope.$state);
       
       $rootScope.$stateParams = $stateParams;
        console.log(" $rootScope.$stateParams" , $rootScope.$stateParams);
       
       $rootScope.assets = data;

        console.log("data")
       
       //Set Variable locations in rootScope for ng-clude items 
       var location = $rootScope.assets;
       $rootScope.layoutTemplate =  'scripts/template-layouts/' + location + '/template-layouts.html';
       $rootScope.navSecondaryTemplate =  'scripts/modules/templates/' + location + '/tmpl_nav/navSecondary.tpl.html';
       $rootScope.svgdirective =  '../images/' + location + '/icons/back.svg';    

 


   
    }
  ]
).config(function($stateProvider, $locationProvider, $urlRouterProvider, $translateProvider, $compileProvider, ApiKey, languageCode,data){
    

  //allow local assets CSP
//  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|chrome-extension):|data:image\//);
//  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: 'scripts/layout.tpl.html'  
  });

 
  //No states are matched, use this as the fallback
  //$locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/onboard');


   
    // Register a loader for the dynamic page
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are api/v1/{api_key}/localisation/resources?lang={LanguageCode}
  $translateProvider.useUrlLoader( ApiKey + '/localisation/resources');
    // Tell the module what language to use by default
  $translateProvider.preferredLanguage(languageCode);
//  console.log(global_API_default_language_code);
//  $translateProvider.use(global_API_default_language_code);
    // Tell the module to store the language in the cookies
  //$translateProvider.useCookieStorage();//cookie storage may not be the best option for mobile apps
  $translateProvider.useLocalStorage();
  $translateProvider.useSanitizeValueStrategy('escaped');



})
//    This code lets you reload any current state anywhere
//    in the application using   $state.forceReload();
//    This is useful for canceling videos in modal
   .config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
});



inflightApp.run(function( $rootScope, $cookieStore, preloader, micrositeApi, $anchorScroll, selector){

// $stateChangeSuccess allows you to run 
// functions everytime a state change occurs 

  $rootScope.$on('$stateChangeSuccess', function () {
      
      
      
    var lastStateloaded =  $rootScope.$state;
    window.localStorage.setItem("lastStateUrlLoaded",lastStateloaded);

    $rootScope.$state = lastStateloaded ;

   //forces the user to the top of the page on state change    
   $anchorScroll();
  
 });
 
 inflightApp.run(function($rootScope, $templateCache) {
     
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined'){
           console.log("current" + current);
            console.log("current" + current);
            $templateCache.remove(current.templateUrl);
        }
    });
});

 

    // iOS hack
  $rootScope.mediaPath = '';

  if(_.isUndefined(window.nonMobile)) {
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
      $rootScope.mediaPath = fileSystem.root.toURL().replace("Library/files/", encodeURIComponent("NorthStar Airlines.app/www")) ;

    }, function(error) {
      console.log('Failed to retrieve retrieve fileSystem handle: %s', error);
    });
  }



     //Preload all images
    var onGetAllContentImagesSuccess = function(data){
                // I keep track of the state of the loading images.
                $rootScope.isLoading = true;
                $rootScope.isSuccessful = false;
                $rootScope.percentLoaded = 0;
                // I am the image SRC values to preload and display./

//                $scope.imageLocations = [
//                    ( "https://micrositeifdstorage.blob.core.windows.net/norwegian/image/slider-hero-extra.jpg" )
//                ];
        var imageLocations = data;

                // Preload the images; then, update display when returned.
                preloader.preloadImages( imageLocations ).then(
                    function handleResolve( imageLocations ) {
                        // Loading was successful.
                        $rootScope.isLoading = false;
                        $rootScope.isSuccessful = true;
                        console.info( "Image Preload Successful" );
                    },
                    function handleReject( imageLocation ) {
                        // Loading failed on at least one image.
                        $scope.isLoading = false;
                        $scope.isSuccessful = false;
                        console.error( "Image Failed", imageLocation );
                        console.info( "Preload Failure" );
                    },
                    function handleNotify( event ) {
                       // $scope.percentLoaded = event.percent;
                        console.info( "Percent loaded:", event.percent + "%" );
                    }
                );
    };
    
    //Stephen, comment out the line below if you DO NOT want to preload images. In some cases, when there is not many images it may be better to disable it!
//    micrositeApi.getAllContentImages().then(onGetAllContentImagesSuccess);



})
.controller('InflightCtrl', [
    '$rootScope',
    '$scope', 
    '$translate',
    '$state', 
    'micrositeApi',
    'preloader',
    'themeServices',
    function ($rootScope, $scope,  $translate, $state, micrositeApi, preloader, themeServices, $localStorage) {
  //back function

  
            //Stephen, the method below should  load the additional language resources(other than the default language) to 
            //avoid issues with $translate service (i.e Filter button in the movies section)
           function loadedResources(response){
                  //console.log('Language Resources loaded for: ar',response);
         }

        micrositeApi.cacheLanguageResources('en').then(loadedResources);
        micrositeApi.cacheLanguageResources('en').then(loadedResources);  

    
    
          var   getLocalStorage = window.localStorage.getItem("langLocalStorage");
        
          if (getLocalStorage === null || getLocalStorage === undefined ){
              
                  $scope.LanguageCurrentLabel = 'en';
                  $rootScope.languageselected = 'en'
          }else{
              
              $scope.LanguageCurrentLabel= getLocalStorage;
          }
      
      
 
       
       
    //Change the App Language
      $scope.changeLanguage = function(langKey) {
          $translate.use(langKey);
        
       
         $rootScope.languageselected= langKey;
         
         //This code sends the  current language to  themeServices 
        //which stores the language in a  variable. If the user 
        //refreshes the page this variabel remembers the last language loaded.    

          window.localStorage.setItem("langLocalStorage", $rootScope.languageselected );
          
         $scope.LanguageCurrentLabel =  themeServices.getlanguage();
          
         
          //Update global variables
          var onSuccess = function(data){
              //update global variables
              var langID =_.where(data, {languageCode: langKey})[0].id;
              //call a method to save a languageID
              micrositeApi.setAppLanguage(langID, langKey);
              // refresh state
             $state.go($state.current, {}, {reload: true});//second parameter is for $stateParams
          };
          
          
          //call service API
          micrositeApi.getAllLanguages().then(onSuccess);
      };
       
         



}]).controller('pageHeaderCtrl', function($scope, $rootScope, menuService) {
    $scope.showMenu = menuService.state();

       
    $scope.toggleMenu = function() {
        menuService.toggle();
        console.log("toggle hit");
    };

    // The menu toggle
    $scope.$watch(function () { return menuService.state(); },
        function (value) {
        $scope.showMenu = menuService.state();
        }
    );

    

 
}).controller('pageMenu', function($scope, $rootScope, menuService) {

    $scope.showMenu = menuService.state();

    var menuElement = document.querySelector('#menu');

    $scope.toggleMenu = function() {
        menuService.toggle();
    };

    // The menu toggle
    $scope.$watch(function () { return menuService.state(); },
        function (value) {
            $scope.showMenu = menuService.state();

            if (menuService.state()) {
                menuElement.focus();
            } else {
                menuElement.blur();
            }
        }
    );


}).directive('svgImage', ['$http', function($http) {
    return {
      restrict: 'E',
      link: function(scope, element) {
        var imgURL = element.attr('src');
        // if you want to use ng-include, then
        // instead of the above line write the bellow:
        // var imgURL = element.attr('ng-include');
        var request = $http.get(
          imgURL,
          {'Content-Type': 'application/xml'}
        );
         
//        console.log("request" +request);

        scope.manipulateImgNode = function(data, elem){
          var $svg = angular.element(data)[4];
//          console.log("data",data);
          var imgClass = elem.attr('class');
          if(typeof(imgClass) !== 'undefined') {
            var classes = imgClass.split(' ');
            for(var i = 0; i < classes.length; ++i){
              $svg.classList.add(classes[i]);
            }
          }
          $svg.removeAttribute('xmlns:a');
          return $svg;
        };

        request.success(function(data){
          element.replaceWith(scope.manipulateImgNode(data, element));
        });
      }
    };
  }]);
       
        
                 
        
                    


