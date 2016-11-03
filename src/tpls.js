angular.module('angularHeadingNavigation').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('heading-navigation-d.html',
    "<ul class=\"heading-navigation\" data-ng-hide=\"devMode\"><li data-ng-repeat=\"item in tree\"><a data-ng-click=\"item.isExpanded=!item.isExpanded\"><strong>{{ item.text }}</strong></a><ul data-ng-if=\"item.sub\" data-uib-collapse=\"!item.isExpanded\"><li data-ng-repeat=\"subItem in item.sub\"><a href=\"#{{subItem.link}}\" data-ng-click=\"hideAllOthers()\">{{ subItem.text }}</a></li></ul></li></ul>"
  );

}]);
