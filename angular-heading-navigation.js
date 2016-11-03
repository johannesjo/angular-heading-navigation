(function() {
    'use strict';

    deactivateUrlRewriting.$inject = ["$locationProvider"];
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

angular.module('angularHeadingNavigation').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/heading-navigation-d.html',
    "<ul class=\"heading-navigation\" data-ng-hide=\"devMode\"><li data-ng-repeat=\"item in tree\"><a data-ng-click=\"item.isExpanded=!item.isExpanded\"><strong>{{ item.text }}</strong></a><ul data-ng-if=\"item.sub\" data-uib-collapse=\"!item.isExpanded\"><li data-ng-repeat=\"subItem in item.sub\"><a href=\"#{{subItem.link}}\" data-ng-click=\"hideAllOthers()\">{{ subItem.text }}</a></li></ul></li></ul>"
  );

}]);

/**
 * @ngdoc directive
 * @element headingNavigation
 * @name headingNavigation.directive:headingNavigation
 * @requires lodash
 * @restrict A
 * @description
 * headingNav
 */

(function() {
    'use strict';

    headingNavigation.$inject = ["$window", "angularHeadingNavigation"];
    angular
        .module('angularHeadingNavigation')
        .directive('headingNavigation', ['$window', 'angularHeadingNavigation', headingNavigation]);

    /* @ngInject */
    function headingNavigation($window, angularHeadingNavigation) {
        var cfg = angularHeadingNavigation.config;

        return {
            templateUrl: 'templates/heading-navigation-d.html',
            link: linkFn,
            restrict: 'A',
            scope: {
                headingNavigationTarget: '@'
            }
        };


        function linkFn(scope) {
            /**
             * Creates 2 level tree structure from headings
             * @param {Array}headerNodes
             * @param {Boolean}devMode
             * @returns {Array}
             */
            function createHeadingTree(headerNodes, devMode) {
                /**
                 *
                 * @param {Object}node
                 * @param {Boolean}devMode
                 * @returns {{text: *, link: *, level: Number}}
                 *
                 */
                function handleHeadingNode(node, devMode) {
                    var nodeNgEl = angular.element(node);
                    var nodeText = nodeNgEl.text();
                    var linkName = $window._.kebabCase(nodeText);
                    var level = parseInt(node.tagName.replace('H', ''));

                    // change link to indicate dev-mode
                    if (devMode) {
                        linkName = 'DEV-' + linkName;
                        if ($window.location.hash.replace('#', '') === linkName) {
                        } else {
                            nodeNgEl.attr('style', 'display:none;');
                            nodeNgEl.next()
                                .attr('style', 'display:none;');
                        }
                    }

                    // make heading linkable
                    nodeNgEl.attr('id', linkName);

                    return {
                        text: nodeText,
                        link: linkName,
                        level: level
                    };
                }

                // shared variables
                var treeStructure = [];
                var currentParentNode;


                for (var i = 0; i < headerNodes.length; i++) {
                    var currentNode = handleHeadingNode(headerNodes[i], devMode);
                    if (currentNode.level === cfg.START_LEVEL) {
                        currentParentNode = currentNode;
                        currentParentNode.sub = [];
                        treeStructure.push(currentParentNode);
                    }
                    if (currentParentNode && currentNode.level > currentParentNode.level) {
                        currentParentNode.sub.push(currentNode);
                    }
                }

                return treeStructure;
            }

            var targetEl = $window.document.querySelectorAll(scope.headingNavigationTarget);
            var headerNodes;
            if (targetEl && targetEl[0]) {
                headerNodes = targetEl[0].querySelectorAll(cfg.HEADINGS_QUERY_SELECTOR);
            } else {
                headerNodes = $window.document.body.querySelectorAll(cfg.HEADINGS_QUERY_SELECTOR);
            }

            scope.tree = createHeadingTree(headerNodes, false);


            scope.$watch(function() {
                return $window.location.hash;
            }, function(hash) {
                if (hash.match(/^#DEV-/)) {
                    scope.devMode = true;
                    scope.tree = createHeadingTree(headerNodes, true);
                } else {
                    scope.devMode = false;
                    scope.tree = createHeadingTree(headerNodes, false);
                }
            });

        }
    }


})();

angular.module('angularHeadingNavigation')
    .provider('angularHeadingNavigation', function angularHeadingNavigationProvider() {
        'use strict';

        // *****************
        // DEFAULTS & CONFIG
        // *****************

        var config = {
            HEADINGS_QUERY_SELECTOR: 'h2[data-heading-navigation-heading],h3[data-heading-navigation-heading]',
            START_LEVEL: 2
        };

        // *************************
        // PROVIDER-CONFIG-FUNCTIONS
        // *************************

        return {
            extendConfig: function(newConfig) {
                config = angular.extend(config, newConfig);
            },


            // ************************************************
            // ACTUAL FACTORY FUNCTION - used by the directive
            // ************************************************

            $get: function() {
                return {
                    config: config
                };
            }
        };
    });
