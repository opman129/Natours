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

// const date = Date.now();
// const current_date = moment(date);

// const next_payment = current_date.add(7, 'days').format('YYYY-MM-DD hh:mm a');
// console.log(next_payment);