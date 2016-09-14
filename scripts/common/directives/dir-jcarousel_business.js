(function () {
    angular.module('inflightApp.jcarouselbus', []).directive('carouselbus', carouselbus).controller('businessController', businessController);

    function carouselbus() {
        return {
            restrict: 'A',
            replace: true,
            transclude: false,
            scope: {
                images: "="
            },
            template: '<div class="jcarousel-wrapper"><div class="jcarousel"><ul><li ng-repeat="img in images"><img ng-src="{{img.imageKey}}" ui-sref="app.menu" style="cursor:pointer; max-width:300px;"/></li></ul></div><a href="javascript:void(0)" class="jcarousel-control-prev">&lsaquo;</a><a href="javascript:void(0)" class="jcarousel-control-next">&rsaquo;</a></div>',
            link: function link(scope, element, attrs) {
                var container = $(element);
                var carousel = container.children('.jcarousel');
                 
                carouselbus.jcarousel({
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



    function businessController($scope, micrositeApi, selector) {



         var onSuccess = function (data) {
        //filter results if flight is selected on route selector page
        var allMenu = selector.filterContentForSelectedFlight(data);
        //random
        allMenu = _.shuffle(allMenu);
        allMenu= _.first(allMenu, 5);//5 random elements




            var images = new Array();

            _.each(allMenu, function(item) {
              //doSomeWorkOn(someThing);
            var image_item = {imageKey: item.contentMeta.image_poster};
                images.push(image_item);
            })
            $scope.images= images;

    }

    //api call to get all menu items
    //the parameter in the getAllContentItemsByType() function is the actual codename of the content type
    micrositeApi.getAllContentItemsByType("menu").then(onSuccess);

    }
    

})();
