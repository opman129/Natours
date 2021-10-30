const multer = require('multer');
const AppError = require('../utils/AppError');

/** Multer makes it easy to deal with Images in Node.js 
 * 
 * multer.memoryStorage() stores images as a buffer
 * multer.diskStorage() stores images on the File System
 * 
 *   MULTER CONFIGURATION
*/
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.minetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb (new AppError('Not an Image, Please Upload only images', 400), false)
    };
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

/** Single Image Upload */
exports.uploadUserProfilePhoto = upload.single('photo');

/** Upload Multiple Images */
exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
]);

/** If only 1 field exists for multiple Image uploads, use
 *  upload.array([{'<fieldName>', <maxCount>}])
 */