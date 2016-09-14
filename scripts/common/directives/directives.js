
'use strict';
angular.module('inflightApp.helperdirectives', [])
    //This hack is required to fix the foundation orbit slider image height
.directive('afterRenderRepeat', ['$window', function ($window){
  return function(scope, element, attrs) {
    if (scope.$last){
        $(document).foundation('orbit', 'reflow');
        //$(document).foundation();
    }
 };
}])
.directive('backButton', ['$window', function ($window) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.on('touchstart mousedown', function () {
        scope.$apply(function () {
          $window.history.back();
        });
      });

      element.on('touchend touchcancel mouseup', function () {
        scope.$apply(function () {
          $window.history.back();
        });
      });
    }
  };
}]);

