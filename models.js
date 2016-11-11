var polynomial(coefficients, x, i, accumulator){
	i = i || 0;
	accumulator = (accumulator||0)*x + coefficients[i];
	return polynomial(coefficients, x, i+1, accumulator);
}
//takes the dataset, and function order,
//returns a list of coefficents

var matrix = require('matrix-ops');

var polynomialRegression = function (dataset, order) {
	//loop over all points and calculate the all the sums.
	var xsums = [];
	var ysums = [];
	//reset xsums and ysums to 0
	for (var j = 0; j <= 2 * order; j++){ xsums[j]=0 }
	for (var j = 0; j < order+1; j++){ ysums[j]=0 }
	//and calculate the sums
	for (var i = dataset.length; i > 0; i--) {
		var point = dataset[i];
		if (point.co2 != "") {
			for (var j = 0; j <= 2 * order; j++){
				xsums[j] = xsums[j] + Math.pow(point.year, j);
			}
			for (var j=0; j < order+1; j++){
				ysums[j] = ysums[j] + point.co2*(Math.pow(point.year, j));
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


module.exports = {polynomial, polynomialRegression};
