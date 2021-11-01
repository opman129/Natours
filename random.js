// const accountNumber = Math.round(Math.)
// console.log(accountNumber);

/** Interest Rate on 1000 in 5 months => A = P(1+(r/n))^(n*t) */
let P = 50000;
let r = 5
let n = 100;
let t = 365;

const A = P * (1+(r/n))^(n*t);
console.log(A);