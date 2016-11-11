/**
 * Created by marcus on 11/11/16.
 */

var fs = require('fs');
var path = require('path');
var co = require('co');
var Q = require('q');
var pol = require("./models");
var getNormalizedData = require('./getNormalizedData');
var matrix = require('matrix-ops');

var country = "United States";

var test = function() {
    co(function * () {
        var result = yield getNormalizedData();
        result.forEach(function(c, i) {
            if (c.name == country) {
                var res = pol.polynomialRegression(c.years, 2);
                console.log(res);
            }
        });
    });
};

test();
