const crypto = require('crypto');
const lnglat = "8.695148949582926, 5.522552101582644";
const longitude = lnglat.split(',')[0];
const latitude = lnglat.split(',')[1];

console.log(longitude, latitude);

let hash = crypto.randomBytes(3).toString('hex');
const key = crypto.randomBytes(3).toString('hex');
const token = `POS-${hash}-${key}`.toUpperCase();

console.log(token);

/** Generate Random Keys */
const reference = crypto.randomUUID();
console.log(reference);



// crypto.generateKey('aes', { length: 20 }, (err, key) => {
//     if (err) console.log(err) 
//     console.log(key.export().toString('hex'));
// })