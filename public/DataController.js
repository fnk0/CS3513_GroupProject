/**
 * Created by marcus on 11/2/16.
 */

(function () {

    var app = angular.module('cs3613');

    app.controller('DataController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope',
        function ($http, $scope, $window, $filter, $location, $rootScope) {
            $http.get(window._base_url + "/line_countries")
                .success(function (data) {
                    $scope.countriesData = data.data;
                    $scope.countriesOptions = data.options;
                    console.log(data.options);
                }).error(function (error) {
                    console.log(error);
                }
            );
        }]);

    app.controller('BarStackedDataController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope',
        function ($http, $scope, $window, $filter, $location, $rootScope) {
            $http.get(window._base_url + "/bar_countries")
                .success(function (data) {
                    $scope.countriesData = data.data;
                    $scope.countriesOptions = data.options;
                }).error(function (error) {
                    console.log(error);
                }
            );
        }]);

    app.controller('IndividualCountryController', ['$http', '$scope', '$window', '$filter', '$location', '$rootScope',
        function ($http, $scope, $window, $filter, $location, $rootScope) {

            $scope.selectedCountry = "United States";
            $scope.selectedData = {};
            $scope.data = {};
            $scope.countries = [];

            var self = this;

            $scope.onChange = function() {
                $scope.selectedCountry = self.s;
                console.log($scope.selectedCountry);
                $scope.selectedData = [];
                $scope.selectedData = [$scope.data[$scope.selectedCountry]];
            };

            $http.get(window._base_url + "/line_individual")
                .success(function (data) {
                    var countryData = data.data;
                    $scope.options = data.options;
                    countryData.forEach(function(c, i) {
                        $scope.countries.push(c.key);
                        $scope.data[c.key] = c;
                        //console.log(c.key);
                        if ($scope.selectedCountry == c.key) {
                            console.log(c);
                            $scope.selectedData = [c];
                        }
                    });
                }).error(function (error) {
                    console.log(error);
                }
            );
        }]);
})();