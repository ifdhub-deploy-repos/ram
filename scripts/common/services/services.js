
(function () {
'use strict';

    angular.module('services.menu', [])
        
        .factory('menuService', function() {
    var showMenu = false;
   
       console.log("showMenu" + showMenu );
    return {
        showMenu: showMenu,
        state: function() {
            return showMenu;
        },
        toggle: function() {
            showMenu = !showMenu;
//             console.log("toggle");
            return showMenu;
        },
        close: function() {
            showMenu = false;
            return showMenu;
        },
        open: function() {
            showMenu = true;
            return showMenu;
        }
    };
});
}());