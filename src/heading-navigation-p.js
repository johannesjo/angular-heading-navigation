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
