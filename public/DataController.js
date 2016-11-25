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

            $scope.trainingRange = [1751, 1925];
            $scope.dataRange = [1924, 2010];

            self.slider = document.getElementById('training');
            noUiSlider.create(self.slider, {
                start: $scope.trainingRange,
                connect: true,
                step: 1,
                range: {
                    'min': 1751,
                    'max': 2011
                },
                format: wNumb({
                    decimals: 0,
                    encoder: function(value){
                        return parseInt(value);
                    }
                })
            });

            self.sliderData = document.getElementById('data_range');
            noUiSlider.create(self.sliderData, {
                start: $scope.dataRange,
                connect: true,
                step: 1,
                range: {
                    'min': 1751,
                    'max': 2100
                },
                format: wNumb({
                    decimals: 0,
                    encoder: function(value){
                        return parseInt(value);
                    }
                })
            });

            self.slider.noUiSlider.on('update', function(values, input) {
                $scope.trainingRange = values;
                self.st = parseInt(values[0]);
                self.et = parseInt(values[1]);
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            });

            self.sliderData.noUiSlider.on('update', function(values, input) {
                $scope.dataRange = values;
                self.start = parseInt(values[0]);
                self.end = parseInt(values[1]);
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            });

            $scope.fetchData = function() {
                fetch();
            };

            $scope.fetch = function (endpoint, start, end, st, et, order, callback) {
                //console.log(self.slider.noUiSlider.get());
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
                });
            };
            fetch();
        }]);
})();