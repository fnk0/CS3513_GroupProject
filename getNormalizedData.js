/**
 * Created by marcus on 11/11/16.
 */

var fs = require('fs');
var path = require('path');
var co = require('co');
var Q = require('q');
var DATA_FILE = path.join(__dirname, 'data_1751.json');

module.exports = function() {
    var deferred = Q.defer();
    fs.readFile(DATA_FILE, function (err, data) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        }
        //res.json(JSON.parse(data));
        data = JSON.parse(data);

        var result = [];

        // Loop through each country
        data.forEach(function (country, i) {
            var myCountry = {};
            myCountry.years = [];
            for (var key in country) {
                // javascript objects have properties that we don't care about
                // So we check if this property is just from our object
                if (country.hasOwnProperty(key)) {
                    if (key == "Country Name") {
                        myCountry.name = country[key];
                    }

                    if (!isNaN(key)) { // check if key is numeric aKa a year
                        myCountry.years.push({
                            year: parseInt(key), // convert this to integer to allow sorting, etc..
                            co2: country[key]
                        });
                    }
                }
            }
            result.push(myCountry);
        });
        deferred.resolve(result);
    });
    return deferred.promise;
};