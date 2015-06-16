/* Task description */
/*
	Write a function that finds all the prime numbers in a range
		1) it should return the prime numbers in an array
		2) it must throw an Error if any on the range params is not convertible to `Number`
		3) it must throw an Error if any of the range params is missing
*/

function findPrimes(from,to) {
    if (from === undefined || to === undefined || isNaN(to) || isNaN(from)) {
        throw new Error('yes');
    }
    else {
        var prime = [],
            n,
            i,
            maxDivisiour,
            isPrime;

        from = +from;
        to = +to;

        for (n = from; n <= to; n++) {
            isPrime = true;

            maxDivisiour = Math.sqrt(n);
			
			if (n < 2) {
                continue;
            }

            for (i = 2; i <= maxDivisiour; i++) {
                
                if (!(n % i)) {
                    isPrime = false;
                    break;
                }
            }

            if (isPrime) {
                prime.push(n);
            }
        }

        return prime;
    }
}

module.exports = findPrimes;
