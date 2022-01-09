const moment = require('moment');

// const accountNumber = Math.round(Math.)
// console.log(accountNumber);

/** Interest Rate on 1000 in 5 months => A = P(1+(r/n))^(n*t) */
let P = 50000;
let r = 5
let n = 100;
let t = 365;

const A = P * (1+(r/n))^(n*t);
// console.log(A);

/** Moment.js for time formatting */
const calculateNextPayment = (chargeType, date) => {
    let current_date;
    if (!chargeType) return null;

    if (chargeType === 'weekly') {
        current_date = moment(date);
        current_date.add(7, 'days').format('YYYY-MM-DD hh:mm a');
        return current_date;

    } else if (chargeType === 'monthly') {
        current_date = moment(date);
        current_date.add(1, 'month').format('YYYY-MM-DD hh:mm a');
        return current_date;
    };

    return current_date;
};

const date = new Date().toISOString();

let next_payment = date;
const next_payment_date = calculateNextPayment('weekly', next_payment);
console.log(next_payment_date.format('YYYY-MM-DD hh:mm a'));

/** Calculate Monthly Payment */
function monthlyPayment(pv, freq, rate, periods) {
    rate = rate / 100 / freq;
    
    const x = Math.pow(1 + rate, periods);
    return (pv * x * rate) / (x - 1);
}

console.log(parseInt(monthlyPayment(5000, 2, 10, 1)).toFixed(2));

/***********************************************
  *  Convert to currency notation               *
  ***********************************************/
 function toCurrency(num) {
    let curr;
    num = Math.round(num * 100) * 0.01;
    const currstring = num.toString();
    if (currstring.match(/\./)) {
        curr = currstring.split('.');
    } else {
        curr = [currstring, "00"];
    }
    curr[1] += "00";
    curr[2] = "";
    let returnval = "";
    const length = curr[0].length;
    
    // add 0 to decimal if necessary
    for (let i = 0; i < 2; i++) 
        curr[2] += curr[1].substr(i, 1);
 
    // insert commas for readability
    for (i = length; (i - 3) > 0; i = i - 3) {
        returnval = "," + curr[0].substr(i - 3, 3) + returnval;
    }
    returnval = curr[0].substr(0, i) + returnval + "." + curr[2];
    return(returnval);
};

console.log(toCurrency(50000000));
