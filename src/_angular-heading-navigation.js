(function() {
    'use strict';

    angular.module('angularHeadingNavigation', [])
        .config(['$locationProvider', deactivateUrlRewriting]);


    /* @ngInject */
    function deactivateUrlRewriting($locationProvider) {
        /* we need this kind of hack, as angular is quite intrusive
         when it comes to rewriting urls. Without this snippet all
         hash links would get an extra slash added to them */
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false,
            rewriteLinks: false
        });
    }
})();
