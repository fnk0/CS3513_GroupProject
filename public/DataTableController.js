/**
 * Created by marcus on 11/18/16.
 */

(function () {

    var app = angular.module('cs3613');

    app.controller('DataTableController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$httpParamSerializer',
        function ($http, $scope, $window, $filter, $location, $rootScope, $httpParamSerializer) {

            var self = this;
            self.chartData = [];
            self.years = [];

            self.orders = ["1", "2", "4", "8", "16"];

            for(var i = 1751; i < 2012; i++) {
                self.years.push(i);
            }

            self.start = 1751;
            self.end = 2011;
            self.st = 1751;
            self.et = 2011;

            $scope.fetchData = function() {
                $scope.fetch(self.start, self.end, self.st, self.et, self.order, function(data) {
                    $scope.data = data;
                });
            };

            $scope.fetch = function (start, end, st, et, order, callback) {
                var query = {
                    country: "United States",
                    stepsize: 1,
                    start: start,
                    end: end,
                    st: st,
                    et: et
                };

                $http.get(window._base_url + "/regression_table?" + $httpParamSerializer(query))
                    .success(function (data) {
                        var result = [];
                        for(var key in data.data) {
                            if (data.data.hasOwnProperty(key)) {
                                if (parseInt(key) % 10 == 1) {
                                    result.push(data.data[key]);
                                }
                            }
                        }
                        callback(result);
                    }).error(function (error) {
                        console.log(error);
                    }
                );
            };

            $scope.fetch(self.start, self.end, self.st, self.et, self.order, function(data) {
                $scope.data = data;
            });
        }]);
})();