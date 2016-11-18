var matrix = require('matrix-ops');

var polynomial = function (coefficients, x, i, accumulator) {
    i = i || 0;
    //console.log(i);
    if (i >= coefficients.length) {
        return accumulator;
    }
    accumulator = (accumulator || 0) * x + coefficients[i];
    return polynomial(coefficients, x, i + 1, accumulator);
};

var filter = function(dataset, s, e) {
    var newDataset = [];
    dataset.forEach(function(val, index) {
        if (val.year && val.year >= s && val.year <= e) {
            newDataset.push(val);
        }
    });
    return newDataset;
};

//takes the dataset, and function order,
//returns a list of coefficents
var polynomialRegression = function (dataset, order) {
    //loop over all points and calculate the all the sums.
    var xsums = [];
    var ysums = [];
    //reset xsums and ysums to 0
    var j;
    for (j = 0; j <= 2 * order; j++) {
        xsums[j] = 0
    }
    for (j = 0; j < order + 1; j++) {
        ysums[j] = 0
    }
    //and calculate the sums
    for (var i = dataset.length - 1; i > 0; i--) {
        var point = dataset[i];
        if (point.co2 != "") {
            for (j = 0; j <= 2 * order; j++) {
                xsums[j] = xsums[j] + Math.pow(point.year, j);
            }
            for (j = 0; j < order + 1; j++) {
                ysums[j] = ysums[j] + point.co2 * (Math.pow(point.year, j));
            }
        }
    }

    //Create a matrix with the data
    var m = [];
    var row = [];
    for (i = 0; i <= order; i++) {
        row = [];
        for (j = 0; j <= order; j++) {
            row.push(xsums[i + j]);
        }
        row.push(ysums[i]);
        m.push(row);
    }

    var reduced = matrix.reducedRowEchelonForm(m);
    var results = [];
    for (i = 0; i < reduced.length; i++) {
        row = reduced[i];
        results.push(row[row.length - 1]);
    }

    results = results.reverse();
    return results;
};

var getError = function (original, estimated) {
    var errors = [];

    original.forEach(function(val, index) {
        var es = estimated[index].y;
        var err = Math.abs((val.y - es) / val.y);
        errors.push({
            x: val.x,
            y: err
        });
    });
    return errors;
};

module.exports = {
    polynomial, polynomialRegression, getError, filter
};
