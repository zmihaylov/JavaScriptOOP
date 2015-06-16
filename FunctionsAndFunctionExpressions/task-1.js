/* Task Description */
/* 
	Write a function that sums an array of numbers:
		numbers must be always of type Number
		returns `null` if the array is empty
		throws Error if the parameter is not passed (undefined)
		throws if any of the elements is not convertible to Number	

*/

function sum(params) {
	
    
    if (params === undefined) {
        throw new Error();
    }
    else if (!params.length) {
        return null;
    }
    else if (params.some(function (num) {
        return isNaN(num);
    })) {
        throw new Error();
    }
    else {
        return params.reduce(function (sum, num) {
            return sum + +num;
        }, 0);
    }

}

module.exports = sum;

module.exports = sum;