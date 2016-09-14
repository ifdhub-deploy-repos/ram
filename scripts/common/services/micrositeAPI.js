//This is the main API service which connects to the MicrositeAPI
//The API base URL and the languageID are global variables and are defined in /app.js
(function () {
    'use strict';

    angular.module('services.micrositeApi', ['ngCookies','themeConfig'])
    .factory('micrositeApi',['$http','$cookieStore' ,'data', 'ApiKey','languageID' ,micrositeApi ]);
      
    
    function micrositeApi($http, $cookieStore, data, ApiKey, languageID, $rootScope) {
        
        
        var  global_API_base_url = ApiKey;
        var  global_API_default_language_id = parseInt(languageID);
       
        //set language if stored in cookie or get initial global variable
        var languageID = $cookieStore.get('langId') || global_API_default_language_id;        
        var api_base = global_API_base_url;
              
        //********
        //Set App language
        //********
        var setAppLanguage = function (_languageID, _langKey) {
            //update cookie
            $cookieStore.put('langId',_languageID);
            $cookieStore.put('langKey',_langKey);
            //fix the service language changes;
            languageID= _languageID;

            return;
        };
        
   
        //Cache the language JSON data
        //api/v1/{api_key}/localisation/resources?lang=fr
        var cacheLanguageResources = function (lang) {
            var api_url = api_base + '/localisation/resources?lang=' + lang;
            return $http.get(api_url, { cache: true})
              .then(function (response) {
                  return response.data;
              });
        };
        
        
        //********
        //Settings (App Settings)
        //********


        //Get a list of App Settings
        //api/v1/{api_key}/settings
        var getAllSettings = function () {
            var api_url = api_base + "/settings";
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };

        //********
        //Content (Content types, items, categories, attributes/filters)
        //********


        //Get a list of content attributes/filters and their options translated into selected language
        //api/v1/{api_key}/content/taxonomy/language/{languageID}
        var getAllAttributes = function () {
            var api_url = api_base + "/content/taxonomy/language/" + languageID;
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };



        //Get a list of content types by language ID
        //api/v1/{api_key}/content/types/language/{languageID}
        var getAllContentTypes = function () {
            var api_url = api_base + "/content/types/language/" + languageID;
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };



        //Get a list of content items of specified type by languageID
        //api/v1/{api_key}/content/type/{content_type_codename}/language/{language_id}
        var getAllContentItemsByType = function (content_type) {
            var api_url = api_base + "/content/type/" + content_type + "/language/" + languageID;
//                  console.log("api_url content " +api_url  );
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };


        //Get a list of content items by language ID, which contain a matching meta record. This method is used for relationship references.
        //api/v1/{api_key}/content/type/{content_type_codename}/language/{language_id}/metakey/{meta_key}/metavalue/{meta_value}
        var getAllContentItemsByTypeAndMeta = function (content_type, meta_key, meta_value) {
            var api_url = api_base + "/content/type/" + content_type + "/language/" + languageID + "/metakey/" + meta_key + "/metavalue/" + meta_value;
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };

        //Get a list of categories by language ID
        //api/v1/{api_key}/content/categories/{languageID}
        var getAllCategories = function () {
            var api_url = api_base + "/content/categories/" + languageID;
//            console.log("api_url " +api_url  );
            return $http.get(api_url, { cache: false})
              .then(function (response) {
//                  console.log("response.data", response.data );
                  return response.data;
          
              });
              
        };
        
        
        //returns child categories of the specified parent category by ID
        var getAllSubcategoriesOfParentCategory = function (allcategories, parentCategoryID ) {

   
                  //var _parentCategory = _.find(allcategories, function (item) { return item.id == parentCategoryID });
            //console.log('Parent Category:', _parentCategory);
                //find categories by parent category ID (Movies parentCategory_ID=68)
                var _subcategories = _.filter(allcategories, function(item){
                   return item.parentCategory_ID == parseInt( parentCategoryID); 
                });
                //console.log('Found sub categories', _subcategories);
                return _subcategories;
         
           
        };
        
        //********
        //Localisation (Language related data)
        //********

        //Get a list of available languages for the App
        //api/v1/{api_key}/localisation/languages
        var getAllLanguages = function () {
            var api_url = api_base + "/localisation/languages";
//             console.log("api_url", api_url);
            return $http.get(api_url, { cache: false})
              .then(function (response) {
//                console.log("getAllLanguages", response.data);
                  return response.data;
              });
        };

        //Get a dictionary of resources translated into a selected language.
        //api/v1/{api_key}/localisation/resources?lang={lang}
        //the lang parameter is the languageCode i.e en, de,...etc
        var getAllLanguageResources = function () {
           
            var lang = $cookieStore.get('langKey');   
            
         if(lang === undefined ){
            
//            todo  need to make the variable below dynamic as some cilent wont use english at all 
             lang = "en";
             
     
         
        }    
            
     
        var api_url = api_base + "/localisation/resources?lang=" + lang ;
            console.log("lang"  + lang  );
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };
        


        //********
        //Storage (Cloud File Storage)
        //********


        //Get a list of all files stored in the cloud
        //api/v1/{api_key}/files
        var getAllFiles = function () {
            var api_url = api_base + "/files";
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };

        //Get a list of files stored in the cloud by directory.
        //api/v1/{api_key}/files/{dir}
        var getAllFilesInDirectory = function (dir) {
            var api_url = api_base + "/files/" + dir;
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  return response.data;
              });
        };

        
        //Get a list of images assigned to content types
        //api/v1/{api_key}/content/loadimages/
        var getAllContentImages = function () {
            var api_url = api_base + "/content/loadimages/";
            return $http.get(api_url)
              .then(function (response) {
                  return response.data;
              });
        };
        
         //********
        // Helper methods which return specfic content types rather than generic ones
        // It's being used to return complex data types, for example having relationships (i.e. audio albums + tracks, tv + episodes..etc)
        //********
        
        //Get a single TV item by title, including all episodes 
        var getTVById = function (id) {
            //return object
            var result = {
                tv: '',
                episodes: ''
            }; 
            
            var api_url = api_base + "/content/type/tv/language/" + languageID;
            //multi chain, cache responses
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                //single tv
                var tv = _.filter(response.data, function(item) {
                    return item.id == id;
                });
                //assign single tv item
                result.tv = tv[0];
   
                //Get All Episodes
                return $http.get(api_base + "/content/type/episode/language/" + languageID, {cache : false})
                    .then(function(response){
                      //return all episodes
                      //console.log('Episodes: ', response.data);
                    
                    //filter
                    var _episodes = _.filter(response.data, function(item) {
                        return item.contentMeta.tv_episode == result.tv.id;
                    });
                    
                    
                    result.episodes =_episodes; //response.data;
                    return result;
                  });
                
              });
        };
        
        
        //Get all TV episodes for specified TV item, by tv item id
        var getAllTVEpisodes = function (id) {
            var api_url = api_base + "/content/type/tv/language/" + languageID;
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                  //return response.data;
                  //get TV ID
                  var singleTvItem = _.where(response.data, {id: id});
                  //console.log('Single TV:', singleTvItem);
                
                  return $http.get(singleTvItem[0].contentItemsRelationships.episode, {cache : false})
                    .then(function(response){
                      //return all episodes
                      //console.log('Episodes: ', response.data);
                    return response.data;
                  });
              });
        };
        
        
        //Get a single Audio album by title, including all Audio Tracks 
        var getAudioAlbumById= function (id) {
            //return object
            var result = {
                audio: '',
                tracks: ''
            }; 
            
            var api_url = api_base + "/content/type/audio/language/" + languageID;
            //multi chain, cache responses
            return $http.get(api_url, { cache: false})
              .then(function (response) {
                //single album
                var audio = _.filter(response.data, function(item) {
                    return item.id == id;
                });
                //assign single audio album 
                result.audio = audio[0];
   
                //Chain All Audio Tracks
                return $http.get( api_base + "/content/type/audio_track/language/" + languageID, {cache : false})
                    .then(function(response){
                    
                     //filter
                    var _tracks = _.filter(response.data, function(item) {
                        return item.contentMeta.audio_album == result.audio.id;
                    });
                    
                    
                      //return all episodes
                    result.tracks = _tracks;//response.data;
                    return result;
                  });
                
              });
        };

       
        
        



        //API public methods
        return {
            //General API methods (Valid For All Clients)
            setAppLanguage: setAppLanguage,
            cacheLanguageResources: cacheLanguageResources,
            getAllSettings: getAllSettings,
            getAllAttributes:getAllAttributes,
            getAllContentTypes: getAllContentTypes,
            getAllContentItemsByType: getAllContentItemsByType,
            getAllContentItemsByTypeAndMeta:getAllContentItemsByTypeAndMeta,
            getAllCategories: getAllCategories,
            getAllSubcategoriesOfParentCategory: getAllSubcategoriesOfParentCategory,
            getAllLanguages: getAllLanguages,
            getAllLanguageResources: getAllLanguageResources,
            getAllFiles: getAllFiles,
            getAllFilesInDirectory: getAllFilesInDirectory,
            getAllContentImages: getAllContentImages,
            //Helper methods for specific content types (Only for Norwegian)
            getTVById: getTVById,
            getAllTVEpisodes: getAllTVEpisodes,
//            getAllLanguageResourcesArabic:getAllLanguageResourcesArabic,
//            getAllLanguageResourcesArabicMovie :getAllLanguageResourcesArabicMovie ,
//            getAllLanguageResourcesFrench:getAllLanguageResourcesFrench,
            getAudioAlbumById: getAudioAlbumById
        };

    };
}());
