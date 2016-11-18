'use strict';
/* global app: true */

(function () {

    var app = angular.module('cs3613', [
        'ngRoute',
        'nvd3',
        'ui.materialize'
    ]);

    //window._base_url = "http://localhost:3000/api";
    window._base_url = "https://cs3513.herokuapp.com/api";

    app.config(function ($httpProvider, $routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'DataController',
                controllerAs: 'ctrl'
            })
            .when('/table', {
                templateUrl: 'table.html',
                controller: 'DataTableController',
                controllerAs: 'ctrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

    app.filter("sanitize", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    }]);
})();