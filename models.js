//takes the dataset, and function order,
//returns a list of coefficents


var polynomial = function (dataset, order) {
    //loop over all points and calculate the all the sums.
    var xsums = [];
    var ysums = [];
    for (var i = dataset.length; i > 0; i--) {
        var point = dataset[i];
        if (point.co2 != "") {
		for (var j = 0; j < 2 * order; j++){
			xsums[j] = xsums[j] + Math.pow(point.year, j);
		}
		for (var j=0; j < order+1; j++){
			ysums[j] = ysums[j] + point.co2*(Math.pow(point.year, j));
		}
        }
    }


    //plug into the matrix

    //row reduce.
    var result = []; //return a list of coefficients

    var m = [];

    for(var i =0; i < dataset.length; i++) {

    }

    return result
};


module.exports = polynomial;
