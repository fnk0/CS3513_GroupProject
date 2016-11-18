/**
 * Created by marcus on 11/2/16.
 */

(function () {

    var app = angular.module('cs3613');

    app.controller('DataController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope', '$httpParamSerializer',
        function ($http, $scope, $window, $filter, $location, $rootScope, $httpParamSerializer) {

            var self = this;
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
            self.stepsize = 1;
            self.st = 1751;
            self.et = 2011;

            $scope.fetch = function () {
                var query = {
                    country: "United States",
                    stepsize: self.stepsize,
                    start: self.start,
                    end: self.end,
                    order: self.order,
                    st: self.st,
                    et: self.et
                };

                $http.get(window._base_url + "/regression?" + $httpParamSerializer(query))
                    .success(function (data) {
                        console.log(data);
                        $scope.options = data.options;
                        $scope.data = data.data;
                    }).error(function (error) {
                        console.log(error);
                    }
                );
            };
            $scope.fetch();
        }]);
})();