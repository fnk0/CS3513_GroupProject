/**
 * Created by marcus on 11/2/16.
 */

(function () {

    var app = angular.module('cs3613');

    app.controller('DataController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$httpParamSerializer',
        function ($http, $scope, $window, $filter, $location, $rootScope, $httpParamSerializer) {

            var self = this;
            self.chartData = [];
            self.orders = [];
            self.years = [];
            for(var i = 1; i < 46; i++) {
                self.orders.push(i);
            }

            for(i = 1751; i < 2012; i++) {
                self.years.push(i);
            }

            self.order = 1;
            self.start = 1924;
            self.end = 2011;
            self.st = 1751;
            self.et = 1924;

            $scope.fetchData = function() {
                fetch();
            };

            $scope.fetch = function (endpoint, start, end, st, et, order, callback) {
                var query = {
                    country: "United States",
                    stepsize: 1,
                    start: start,
                    end: end,
                    order: order,
                    st: st,
                    et: et
                };

                $http.get(window._base_url + "/" + endpoint + "?" + $httpParamSerializer(query))
                    .success(function (data) {
                        callback(data.data, data.options);
                    }).error(function (error) {
                        console.log(error);
                    }
                );
            };

            var fetch = function() {
                $scope.fetch("regression", self.start, self.end, self.st, self.et, self.order, function(data, options) {
                    $scope.data = data;
                    $scope.options = options;
                });

                $scope.fetch("averages", self.start, self.end, self.st, self.et, self.order, function(data, options) {
                    $scope.data2 = data;
                    $scope.options2 = options;
                    $scope.options2.chart.forceY = 1;
                    $scope.options2.chart.yScale = d3.scale.log();
                    $scope.options2.yAxis.tickFormat = function(d) {
                        return null
                    };
                });
            };
            fetch();
        }]);
})();