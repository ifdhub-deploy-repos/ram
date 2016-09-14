(function () {
'use strict';

angular.module('inflightApp.player', [
  "ngSanitize",
  "com.2fdevs.videogular",
  "com.2fdevs.videogular.plugins.controls",
  "com.2fdevs.videogular.plugins.overlayplay",
  "com.2fdevs.videogular.plugins.buffering",
  "com.2fdevs.videogular.plugins.poster",
  "services.media"
])

.config(function($stateProvider) {
  $stateProvider
    .state('app.playmovie', {
      url: '/player/movie/:id',
      
      views: {
        'main': {
          controller: 'VideoCtrl',
          templateUrl: 'scripts/modules/inflight/player/player.tpl.html'
         // data : { title: 'Movies'}
        }
      } ,
      resolve: {

          mediaResource: 'media',

          media: function(mediaResource, $stateParams){
            return mediaResource.getMovie($stateParams.id);
          }
      }
    })
    .state('app.playtv', {
      url: '/player/tv/:id/:season/:episode',
      views: {
        'main': {
          controller: 'VideoCtrl',
          templateUrl: 'scripts/modules/inflight/player/player.tpl.html'
        }
      },
      resolve: {

          mediaResource: 'media',

          media: function(mediaResource, $stateParams){
            return mediaResource.getTv($stateParams.id, $stateParams.season, $stateParams.episode);
          }
      }
    })
    .state('app.playaudio', {
      url: '/player/audio/:id/:album',
      views: {
        'main': {
          controller: 'VideoCtrl',
          templateUrl: 'scripts/modules/inflight/player/player.tpl.html'
        }
      },
      resolve: {

          mediaResource: 'media',

          media: function(mediaResource, $stateParams){
            return mediaResource.getAudio($stateParams.id, $stateParams.album);
          }
      }
    });
})


.controller('VideoCtrl', function($rootScope, $scope, $stateParams, $sce, media) {
 
  $scope.item = media.metadata;
  $scope.hidenav = function(){
    return $scope.item.type === 'audio';
  };
  //$scope.vid = $rootScope.mediaPath + $scope.item.media.source;
  //$scope.vid =media.metadata.media[0].source;//mp4

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
        console.log('Playback', media.metadata);
        if(media.metadata.media[0] !== null ){
            var video_1 = {src:  media.metadata.media[0].source, type: media.metadata.media[0].type};
            allSources.push(video_1);
        }
        if(media.metadata.media[1] !== null){
            var video_2 = {src: media.metadata.media[1].source, type: media.metadata.media[1].type};
            allSources.push(video_2);
        }
        if(media.metadata.media[2] !==null ){
            var video_3 = {src: media.metadata.media[2].source, type: media.metadata.media[2].type};
            allSources.push(video_3);
        }
    }
     if($scope.item.type === 'audio' ) {
           var audio_mp3 = {src: media.metadata.media[0].source, type: media.metadata.media[0].type};
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

}());