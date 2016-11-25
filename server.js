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
var models = require("./models");
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

// Normalizes the dataset
app.get('/api/all_data', function (req, res) {
    co(function * () {
        var result = yield getNormalizedData();
        res.json(result);
    });
});

app.get('/api/regression', function (req, res) {
    co(function * () {
        var data = [];
        var result = yield getNormalizedData();
        var dataset = [];
        var country = req.query.country || "United States";
        var stepSize = parseInt(req.query.stepsize || 1);
        var s = parseInt(req.query.start) || 1751;
        var e = parseInt(req.query.end) || 2011;
        var st = parseInt(req.query.st) || 1751;
        var et = parseInt(req.query.et) || 2011;
        var order = req.query.order || 2;

        var originalData = [];

        result.forEach(function (c, i) {
            if (c.name == country) {
                var years = c.years;
                years.forEach(function (year, i) {
                    if (year.year && year.year >= s && year.year <= e) {
                        var co2 = 0;
                        if (year.co2 != "") {
                            co2 = year.co2;
                        }
                        originalData.push({
                            x: year.year,
                            y: co2
                        });
                    }
                });
                data.push({
                    key: "Original Values",
                    color: "#009688",
                    values: originalData,
                    area: true
                });
                dataset = c.years;
            }
        });

        var coefficients = models.polynomialRegression(models.filter(dataset, st, et), order);
        var modelData = [];
        for (var i = s; i <= e; i += stepSize) {
            modelData.push({
                x: i,
                y: models.polynomial(coefficients, i)
            });
        }

        var options = {
            chart: {
                type: 'lineWithFocusChart',
                height: 450,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 45,
                    left: 80
                },
                useInteractiveGuideline: true,
                clipEdge: true,
                duration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Years',
                    showMaxMin: false,
                    tickFormat: function (d) {
                        return d3.format('.f')(d);
                    }
                },
                yAxis: {
                    axisLabel: 'million metric tons of carbon',
                    showMaxMin: false,
                    axisLabelDistance: 5,
                    tickFormat: function (d) {
                        return d3.format('.1f')(d);
                    }
                }
            }
        };

        var errors = models.getError(originalData, modelData, false);

        data.push({
            key: "Regression",
            color: "#FF9800",
            values: modelData,
            area: true
        });

        data.push({
            key: "Error",
            color: "#F44336",
            values: errors,
            area: true
        });

        res.json({
            options: options,
            data: data
        });
    }).catch(function (err) {
        console.log(err.stack);
    });
});

var getRegressionErrors = function (req, res) {
    var deferred = Q.defer();

    co(function * () {
        var data = yield getErrorsForRequest(req, true);
        var result = {};
        data.forEach(function (v, i) {
            var values = v.values;
            values.forEach(function (iv, j) {
                var year = iv.x;
                var point = result[year] || {};
                var data = point.data || [];
                data.push({
                    o: v.order,
                    v: iv.y
                });
                result[year] = {
                    year: year,
                    data: data
                };
            });
        });

        deferred.resolve(result);
    }).catch(function (err) {
        console.log(err.stack);
        deferred.reject(err);
    });

    return deferred.promise;
};

var getErrorsForRequest = function (req, absolute) {
    var deferred = Q.defer();

    co(function * () {
        var data = [];
        var resultData = yield getNormalizedData();
        var dataset = [];
        var country = req.query.country || "United States";
        var stepSize = parseInt(req.query.stepsize || 1);
        var start = parseInt(req.query.start) || 1751;
        var end = parseInt(req.query.end) || 2011;
        var trainingStart = parseInt(req.query.st) || 1751;
        var trainingEnd = parseInt(req.query.et) || 2011;

        var originalData = [];

        resultData.forEach(function (c, i) {
            if (c.name == country) {
                dataset = c.years;
                originalData = models.getDatapoints(dataset, start, end);
            }
        });

        for (var o = 1; o < 17; o *= 2) {
            var coefficients = models.polynomialRegression(models.filter(dataset, trainingStart, trainingEnd), o);
            var modelData = [];
            for (var i = start; i <= end; i += stepSize) {
                modelData.push({
                    x: i,
                    y: models.polynomial(coefficients, i)
                });
            }
            var errors = models.getError(originalData, modelData, absolute);
            data.push({
                order: o,
                values: errors
            });
        }
        deferred.resolve(data);
    }).catch(function (err) {
        console.log(err.stack);
        deferred.reject(err);
    });

    return deferred.promise;
};

app.get('/api/regression_table', function (req, res) {
    co(function * () {
        var result = yield getRegressionErrors(req, res);
        res.json({
            data: result
        });

    }).catch(function (err) {
        console.log(err.stack);
    })
});

app.get("/api/averages", function (req, res) {
    co(function * () {

        var start = parseInt(req.query.start) || 1751;
        var end = parseInt(req.query.end) || 2011;
        var power = req.query.power || 2;

        var data = yield getErrorsForRequest(req, false);
        var validationData = getAverageForRange(data, start, end, power);

        var trainingStart = parseInt(req.query.st) || 1751;
        var trainingEnd = parseInt(req.query.et) || 2011;
        req.query.end = trainingEnd;
        req.query.start = trainingStart;
        data = yield getErrorsForRequest(req, false);
        var trainingData = getAverageForRange(data, trainingStart, trainingEnd, power);
        req.query.end = end;
        data = yield getErrorsForRequest(req, false);

        var barOptions = {
            chart: {
                "type": "multiBarHorizontalChart",
                "height": 400,
                "margin": {
                    "top": 20,
                    "right": 20,
                    "bottom": 45,
                    "left": 45
                },
                "clipEdge": true,
                "duration": 500,
                "stacked": false,
                groupSpacing: 0.25,
                showValues: true,
                showYAxis: false,
                "xAxis": {
                    "axisLabel": "Order",
                    "showMaxMin": false
                }
            }
        };

        var result = [];
        result.push({
            key: "Training Set",
            color: "#3F51B5",
            values: trainingData
        });

        result.push({
            key: "Validation Set",
            color: "#009688",
            values: validationData
        });

        result.push({
            key: "Total Set",
            color: "#FF9800",
            values: getAverageForRange(data, trainingStart, end, power)
        });

        res.status(200).json({
            options: barOptions,
            data: result
        });
    }).catch(function (err) {
        console.log(err.stack);
    })
});

var getAverageForRange = function (dataset, start, end, power) {
    var result = [];
    dataset.forEach(function (val, i) {
        var r = {};
        r.x = val.order;

        var filtered = val.values.filter(function (obj) {
            return obj.x >= start && obj.x < end
        });

        var errors = filtered.map(function (obj) {
            return obj.y;
        });
        //console.log(errors);
        r.y = models.average(errors, power);
        result.push(r);
    });
    return result;
};

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
