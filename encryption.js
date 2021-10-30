const crypto = require('crypto');
const lnglat = "8.695148949582926, 5.522552101582644";
const longitude = lnglat.split(',')[0];
const latitude = lnglat.split(' ')[1];

console.log(longitude, latitude);

const hash = crypto.randomBytes(3).toString('hex');
const key = crypto.randomBytes(3).toString('hex');
const token = `POS-${hash}-${key}`.toUpperCase();

console.log(token);
if (token.split('-')[0] !== 'POS') console.log('not pos')

/** Generate Random Keys with randomUUID() method */
const reference = crypto.randomUUID();
// console.log(reference);

/** PBKDF2 - NICE ALGORITHM */
crypto.pbkdf2('paswordwerd', 'sha256-rhwwglwe-vwwefw', 12, 64, 'sha256', (err, key) => {
    if (err) throw err;
    // console.log(key.toString('hex'));
});

// const algorithm = 'aes-256-cbc';
// const key = 'pass'; //Here I would get the password of the user

/** -------------- ENCRYPTION ------------------- */

/** SYMMETRIC ENCRYPTION - USE OF ONE KEY */
function encrypt(text) {
    /** iv = initialization vector */
    const iv = crypto.randomBytes(16);

    /** Create Key */
    let key = crypto.scryptSync('password', 'salt', 32);

    /** Perform Encryption */
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

/**  ---------------- ENCRYPTING DATA AT REST --------------- 
 *  ----------------- SYMMETRIC ENCRYPTION --------------------
 * This kind of encryption means there's only one key used to encrypt
 * and decrypt data
 * 
 * Cipher and Decipher classes are used for encryption and decryption
 * in Node.js 
*/

// function (encrypt) {
//     let encryption = crypto.createCipheriv('aes-256-cbc', )
// }

console.log(encrypt('Opemipojokotagba'));

// const crypto = require('crypto');
// const algorithm = 'aes-256-cbc';
// const key = 'pass'; //Here I would get the password of the user

// function encrypt(text) {
//    const iv = crypto.randomBytes(16);
//    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//    let encrypted = cipher.update(text);
//    encrypted = Buffer.concat([encrypted, cipher.final()]);
//    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
// }

// function decrypt(text) {
//    let iv = Buffer.from(text.iv, 'hex');
//    let encryptedText = Buffer.from(text.encryptedData, 'hex');
//    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
//    let decrypted = decipher.update(encryptedText);
//    decrypted = Buffer.concat([decrypted, decipher.final()]);
//    return decrypted.toString();
// }


/** ---------------- ASYMMETRIC ENCRYPTION ------------- */
const sally = crypto.createDiffieHellman(205);
const sallyKeys = sally.generateKeys();

const bob = crypto.createDiffieHellman(sally.getPrime(), sally.getGenerator());

const bobKey = bob.generateKeys();
const sallySecret = sally.computeSecret(bobKey);
const bobSecret = bob.computeSecret(sallyKeys);
console.log(sallySecret.toString('hex'));

console.log(bobSecret.toString('hex'))