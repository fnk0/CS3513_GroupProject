/**
 * Created by marcus on 10/20/16.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var co = require('co');
var Q = require('q');
var app = express();
var models = require("./models")
var getNormalizedData = require('./getNormalizedData');
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

var sortByKey = function (array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
};

// Normalizes the dataset
app.get('/api/all_data', function (req, res) {
    co(function * () {
        var result = yield getNormalizedData();
        res.json(result);
    });
});

app.get('/api/line_countries', function (req, res) {
    co(function * () {
        var result = yield getNormalizedData();
        var data = [];
        var totalData = {};
        var countryData = [];
        result.forEach(function (country, i) {
            var years = country.years;

            years.forEach(function (year, i) {
                if (year.year) {
                    var d = totalData["" + year.year];
                    var co2 = 0;
                    if (year.co2 != "") {
                        co2 = year.co2;
                    }
                    if (d) {
                        d.co2 = d.co2 + co2;
                    } else {
                        d = {
                            year: year.year,
                            co2: co2
                        };
                    }
                    totalData["" + year.year] = d;
                }
            });
        });

        for(var key in totalData) {
            if (totalData.hasOwnProperty(key)) {
                countryData.push({
                    x: parseInt(key),
                    y: totalData[key].co2
                })
            }
        }

        data.push({
            key: "CO2",
            values: countryData,
            area: true
        });

        var options = {
            chart: {
                type: 'lineChart',
                height: 600,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                "showLegend": false,
                clipEdge: true,
                duration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Years',
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'CO2',
                    axisLabelDistance: -20,
                    tickFormat: function (d) {
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };
        res.json({
            options: options,
            data: data
        });
    });
});

app.get('/api/bar_countries', function (req, res) {
    co(function * () {
        var result = yield getNormalizedData();
        var data = [];
        result.forEach(function (country, i) {

            var years = country.years;
            var countryData = [];
            years.forEach(function (year, i) {
                if (year.year) {
                    var co2 = 0;
                    if (year.co2 != "") {
                        co2 = year.co2;
                    }
                    countryData.push({
                        x: year.year,
                        y: co2
                    });
                }
            });
            data.push({
                key: country.name,
                values: countryData
            });
        });

        var options = {
            chart: {
                type: 'multiBarChart',
                height: 600,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                "showLegend": false,
                clipEdge: true,
                duration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Years',
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'CO2',
                    axisLabelDistance: 10,
                    tickFormat: function (d) {
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };
        res.json({
            options: options,
            data: data
        });
    });
});

app.get('/api/line_individual', function (req, res) {
    co(function * () {
        var result = yield getNormalizedData();
        var data = [];
        result.forEach(function (country, i) {
            var years = country.years;
            var countryData = [];
            years.forEach(function (year, i) {
                if (year.year) {
                    var co2 = 0;
                    if (year.co2 != "") {
                        co2 = year.co2;
                    }
                    countryData.push({
                        x: year.year,
                        y: co2
                    });
                }
            });
            data.push({
                key: country.name,
                values: countryData,
                area: true
            });
        });

        var options = {
            chart: {
                type: 'lineChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 45
                },
                "showLegend": false,
                clipEdge: true,
                duration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Years',
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.format(',f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'CO2',
                    axisLabelDistance: 10,
                    tickFormat: function (d) {
                        return d3.format(',.1f')(d);
                    }
                }
            }
        };
        res.json({
            options: options,
            data: data
        });
    });
});

app.get('api/regression', function(req, res) {
    co(function * () {
        var result = yield getNormalizedData();
	var dataset 
	results.forEach(function (country, i) {
		if (country.name == req.query.country) {
			dataset = country.years;
		}
	});
	
	var coefficients = models.regress(dataset, req.query.order);
	var modelData = [];
	
	for (var i=req.query.x; i<=req.query.y; i=i+req.query.stepsize){
		modelData.push({
			x: i;
			y: models.polynomial(coefficients, x);
		});
	}
	
	var data = []
	data.push({
		key: req.query.name,
		values: modelData,
		area: true
	});
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
