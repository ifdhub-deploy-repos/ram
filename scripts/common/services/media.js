
'use strict';
angular.module('services.media', [])
  .factory('media',['$http', 'micrositeApi', function ($http, micrositeApi, resolveJson) {
      return {

          getMovie: function (id) {

              //API promise(success)
               var onSuccess = function (data) {
                    //filter movie by title
                    var movie = _.filter(data, function(item) {
                        return item.id == id;
                    });
                    //get the first element in array
                    var movie= movie[0];
                   console.log('media.js , getMovie invoked, data:' + movie.id);
                   
                   //prepare the object to be returned
                    var mediaFiles =[];
                    //add media files
                        if(movie.contentMeta.media_mp4 != null && movie.contentMeta.media_mp4 != ''){
                            var mp4 = {'source':movie.contentMeta.media_mp4, 'type' : 'video/mp4' };
                            mediaFiles.push(mp4);
                        }
                       if(movie.contentMeta.media_webm != null && movie.contentMeta.media_webm != ''){
                                var webm = {'source':movie.contentMeta.media_webm, 'type' : 'video/webm' };
                                mediaFiles.push(webm);
                        }
                   if(movie.contentMeta.media_ogv != null && movie.contentMeta.media_ogv != ''){
                                var ogv = {'source':movie.contentMeta.media_ogv, 'type' : 'video/ogg' };
                                mediaFiles.push(ogv);
                        }
                        //console.log('media',media);
                   
                   //images will be undefined
                   var images = [];
                   
                   
                    var sanitizedDataSet = { type: 'movie', title: movie.id, images: images, media: mediaFiles };
                    movie.metadata = sanitizedDataSet;
                  return movie;
                   
                }
               //API call
               return micrositeApi.getAllContentItemsByType("movies").then(onSuccess);
              
              //********************************************
              //old code
//              var url = '/api/movie/' + id;
//              
//
//              return $http.get(url).success(function (data) {
//                  console.log('media.js , getMovie invoked, data:' + data.title);
//                  var mediaSet = ['TSSG0714M0001_EngTrailer.mp4',
//                      'TSSG0714M0002_EngTrailer.mp4',
//                      'TSSG0714M0003_EngTrailer.mp4',
//                      'TSSG0714M0004_EngTrailer.mp4',
//                      'TSSG0714M0005_EngTrailer.mp4',
//                      'TSSG0714M0031_EngTrailer.mp4',
//                      'TSSG0714M0032_EngTrailer.mp4',
//                      'TSSG0714M0035_EngTrailer.mp4',
//                      'TSSG0714M0036_EngTrailer.mp4',
//                      'TSSG0714M0001_EngTrailer.mp4',
//                      'TSSG0714M0009_EngTrailer.mp4',
//                      'TSSG0714M0016_EngTrailer.mp4',
//                      'TSSG0714M0028_EngTrailer.mp4',
//                      'TSSG0714M0037_EngTrailer.mp4',
//                      'TSSG0714M0021_EngTrailer.mp4',
//                      'TSSG0714M0022_EngTrailer.mp4',
//                      'TSSG0714M0023_EngTrailer.mp4',
//                      'TSSG0714M0024_EngTrailer.mp4',
//                      'TSSG0714M0025_EngTrailer.mp4'
//                  ];
//
//                  var sanitizedDataSet = { type: 'movie', title: data.title, images: data.images, media: data.media };
//
//                  // checks to see if there is a match in mediaSet(Lodash)
//                  if (_.find(mediaSet, function (medium) { return medium == data.media.source })) {
//
//
//                      sanitizedDataSet.media.source = 'assets/seed/media/movies/' + data.media.source;
//                  } else {
//                      //If there is no match selects a random film 
//                      var randomMedia = mediaSet[Math.floor(Math.random() * mediaSet.length)];
//                      sanitizedDataSet.media.source = 'assets/seed/media/movies/' + randomMedia;
//                  }
//                  data.metadata = sanitizedDataSet;
//                  console.log('MedaiResource dataset', data);
//                  return data;
//
//              });


          },

          getTv: function (id, season, episode) {

               
      //episode_media_file
                var onSuccess = function(data){
                    console.log('media.js , getTv invoked, data:' + data.tv.contentMeta.tv_title);
                    
                    var tv= data.tv;
                    var episodes = data.episodes;
                    //find proper episode
                    var selectedEpisode =  _.find(episodes, function (item) { return item.contentMeta.episode_season == season && item.contentMeta.episode_number == episode });
                    //console.log('Found Episode', selectedEpisode);
                    
                    //prepare the object to be returned
                    var mediaFiles =[];
                    //add media files
                        if(selectedEpisode.contentMeta.episode_media_file != null && selectedEpisode.contentMeta.episode_media_file != ''){
                            var episode_video = {'source':selectedEpisode.contentMeta.episode_media_file, 'type' : 'video/mp4' };
                            mediaFiles.push(episode_video);
                        }
                    //add images
                   var images = [];
                    
                     var sanitizedDataSet = { type: 'tv', title:  data.tv.contentMeta.tv_title, season: season, episode: episode, media: mediaFiles };
                    data.metadata = sanitizedDataSet;
                  return data;
                    
                }
              //API call
              return micrositeApi.getTVByTitle(id).then(onSuccess);
              
              
              
              
              
              //Old Code
              
//              var url = '/api/tv/' + id;
//              return $http.get(url).success(function (data) {
//
//                  var mediaSet = ['TSSG0814S0006.mp4', 'TSSG0814S0010.mp4', 'TSSG0814S0017.mp4'];
//                  var tvData = _.find(data.seasons, function (item) { return item.title == season });
//                  var tvEpisode = _.find(tvData.episodes, function (item) { return item.number == episode });
//
//                  var sanitizedDataSet = { type: 'tv', title: data.title, season: season, episode: episode, media: tvEpisode.media[0] };
//
//                  if (_.find(mediaSet, function (medium) { return medium == sanitizedDataSet.media.source })) {
//                      sanitizedDataSet.media.source = 'assets/seed/media/tv/' + sanitizedDataSet.media.source;
//                  } else {
//                      var randomMedia = mediaSet[Math.floor(Math.random() * mediaSet.length)];
//                      sanitizedDataSet.media.source = 'assets/seed/media/tv/' + randomMedia;
//                  }
//                  data.metadata = sanitizedDataSet;
//                  return data;
//              });

          },


          getAudio: function (id, album) {

              
              
               //API promise(success)
               var onSuccess = function (data) {
                  
                   var audio = data.audio;
                   var tracks = data.tracks;
                   audio.tracks = data.tracks;
                   
                   var track = _.find(tracks, function (item) { return item.contentMeta.track_title == id });
                 
                   console.log('media.js , getAudio invoked, data:' + audio.contentMeta.audio_title);
                   
                   //prepare the object to be returned
                    var mediaFiles =[];
                    //add media files
                        if(track.contentMeta.track_media != null && track.contentMeta.track_media != ''){
                            var mp3 = {'source':track.contentMeta.track_media, 'type' : 'video/mp4' };
                            mediaFiles.push(mp3);
                        }
                     
                        //console.log('media',media);
                   
                   //images will be undefined
                   var images = [];
                   
                   
                    var sanitizedDataSet = { type: 'audio', title: track.contentMeta.track_title, images: images, media: mediaFiles };
                    audio.metadata = sanitizedDataSet;
                  return audio;
                   
                }
               //API call
               return micrositeApi.getAudioAlbumByTitle(album).then(onSuccess);
              
              
              
              
              
              
//              var url = '/api/audio/' + id;
//              return $http.get(url).success(function (data) {
//
//                  var mediaSet = ['TSSGA091400101.mp3', 'TSSGA091400201.mp3', 'TSSGA091400301.mp3', 'TSSGA091400401.mp3', 'TSSGA091400501.mp3', 'TSSGA091400601.mp3'];
//
//                  var sanitizedDataSet = { type: 'audio', title: data.title, images: data.images, media: data.media[0] };
//
//
//                  if (_.find(mediaSet, function (medium) { return medium == data.media.source })) {
//                      sanitizedDataSet.media.source = 'assets/seed/media/audio/' + data.media.source;
//                  } else {
//                      var randomMedia = mediaSet[Math.floor(Math.random() * mediaSet.length)];
//                      sanitizedDataSet.media.source = 'assets/seed/media/audio/' + randomMedia;
//                  }
//                  data.metadata = sanitizedDataSet;
//                  return data;
//              });

          },


          getPublication: function (id) {

              var url = '/api/publication/' + id;
              return $http.get(url).success(function (data) {

                  var sanitizedDataSet = { type: 'publication', title: data.title, images: data.images, media: data.media[0] };
                  sanitizedDataSet.media.source = 'assets/seed/media/publications/' + data.media.source;

                  data.metadata = sanitizedDataSet;
                  return data;

              });

          }


      }
  }]);
