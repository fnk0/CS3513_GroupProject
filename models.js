//takes the dataset, and function order,
//returns a list of coefficents

var matrix = require('matrix-ops');

var polynomial = function (dataset, order) {
    //loop over all points and calculate the all the sums.
    var xsums = [];
    var ysums = [];
    var i = 0;
    var j = 0;
    //reset xsums and ysums to 0
    for (j = 0; j <= 2 * order; j++) {
        xsums[j] = 0
    }
    for (j = 0; j < order + 1; j++) {
        ysums[j] = 0
    }
    //and calculate the sums
    for (i = dataset.length -1; i >= 0; i--) {
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

    //console.log(xsums);
    //console.log(ysums);

    //plug into the matrix
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

    //console.log(m);

    var reduced = matrix.reducedRowEchelonForm(m);
    var results = [];
    for(i = 0; i < reduced.length; i++) {
        row = reduced[i];
        results.push(row[row.length -1]);
    }

    return results;
};


module.exports = polynomial;
