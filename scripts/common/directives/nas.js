(function() {
    "use strict";

    angular.module('nas.brand',[])
        .directive('scrollTo', ['scrollTo',
        function(scrollTo) {

            // Get element top pos relative to the page
            function objectTop(obj) {
                var curtop = 0;

                if (obj.offsetParent) {
                    do {
                        curtop += obj.offsetTop;

                    } while (obj = obj.offsetParent);
                }
                return curtop;
            }

            return {
                link: function(scope, element, attrs) {
                    // Bind click
                    angular.element(element).bind('click', function() {
                        if (attrs.scrollTo != 'top') {
                            var scrollToObj = document.querySelector(attrs.href);
                            scrollTo(document.body, objectTop(scrollToObj), 300);
                        } else {
                            scrollTo(document.body, 0, 300);
                        }
                    });
                }
            };
        }]);
})();


