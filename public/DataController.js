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
            self.start = 1751;
            self.end = 2011;
            self.st = 1751;
            self.et = 2011;

            $scope.fetch = function (start, end, st, et, order, callback) {
                var query = {
                    country: "United States",
                    stepsize: 1,
                    start: start,
                    end: end,
                    order: order,
                    st: st,
                    et: et
                };

                $http.get(window._base_url + "/regression?" + $httpParamSerializer(query))
                    .success(function (data) {
                        console.log(data);
                        $scope.options = data.options;
                        callback(data.data);
                        console.log(self.chartData);
                    }).error(function (error) {
                        console.log(error);
                    }
                );
            };
            $scope.fetch(self.start, self.end, self.st, self.et, self.order, function(data) {
               $scope.data = data;
            });

            $scope.fetch(self.start, self.end, 1900, 1945, self.order, function(data) {
                $scope.data2 = data;
            });
        }]);
})();