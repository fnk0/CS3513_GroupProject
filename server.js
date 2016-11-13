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
        var s = parseInt(req.query.start);
        var e = parseInt(req.query.end);

        result.forEach(function (c, i) {
            if (c.name == country) {
                var years = c.years;
                var countryData = [];
                years.forEach(function (year, i) {
                    if (year.year && year.year >= s && year.year <= e) {
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
                    key: "Original Values",
                    color: "#009688",
                    values: countryData,
                    area: true
                });
                dataset = c.years;
            }
        });

        var coefficients = models.polynomialRegression(dataset, req.query.order);
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
        data.push({
            key: "Regression",
            color: "#FF9800",
            values: modelData,
            area: true
        });
        res.json({
            options: options,
            data: data
        });
    }).catch(function(err) {
        console.log(err.stack);
    });
});

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
