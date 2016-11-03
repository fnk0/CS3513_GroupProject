'use strict';
/* global app: true */

(function () {

    var app = angular.module('cs3613', [
        'ngRoute',
        'nvd3',
        'ui.materialize'
    ]);

    window._base_url = "http://localhost:3000/api";

    app.config(function ($httpProvider, $routeProvider, $locationProvider) {
        $routeProvider
            .when('/main', {
                templateUrl: 'total.html',
                controller: 'DataController',
                controllerAs: 'ctrl'
            })
            .when('/bar_stacked', {
                templateUrl: 'main.html',
                controller: 'BarStackedDataController',
                controllerAs: 'ctrl'
            })
            .when('/by_country', {
                templateUrl: 'individuals.html',
                controller: 'IndividualCountryController',
                controllerAs: 'ctrl'
            })
            .otherwise({
                redirectTo: '/main'
            });
    });

    app.filter("sanitize", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    }]);
})();