(function () {
    angular.module('inflightApp.jcarousel', []).directive('carousel', carousel)
            
            
     .controller('movieController', movieController);

    function carousel() {
        return {
            restrict: 'A',
            replace: true,
            transclude: false,
            scope: {
                images: "="
            },
            template: '<div class="jcarousel-wrapper"><div class="jcarousel"><ul><li ng-repeat="img in images"><img src ="{{img.imageKey}}"></li></ul></div><a href="javascript:void(0)" class="jcarousel-control-prev">&lsaquo;</a><a href="javascript:void(0)" class="jcarousel-control-next">&rsaquo;</a></div>',
            link: function link(scope, element, attrs) {
                var container = $(element);
                var carousel = container.children('.jcarousel');
                 
                carousel.jcarousel({
                    wrap: 'circular'
                });

                scope.$watch(attrs.images, function (value) {
                    carousel.jcarousel('reload');
                });

                container.find('.jcarousel-control-prev')
                    .jcarouselControl({
                    target: '-=1'
                });

                container.find('.jcarousel-control-next')
                    .jcarouselControl({
                    target: '+=1'
                });
            }
        };
    }



      function movieController($scope) {

//         $scope.images = [{
//     imageKey: 'app/scripts/carousel/images/menu-1.jpg'
//     
//      
//            }];

        $scope.movies = [{
            imageKey: 'images/assets/movies/movie-1.jpg' 
        }, {
            imageKey: 'images/assets/movies/movie-2.jpg'
        }, {
            imageKey: 'images/assets/movies/movie-3.jpg'
        }, {
            imageKey: 'images/assets/movies/movie-4.jpg'
        }, {
            imageKey: 'images/assets/movies/movie-5.jpg'
        }, {
            imageKey: 'images/assets/movies/movie-6.jpg'
        }];
    }


    

})();