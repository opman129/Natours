const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');

/** ------------ IMAGE PROCESSING FOR NODE.JS ------------- */

/** ------------ Resize User Image --------------*/
exports.resizeUserImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now().jpeg}`

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

/** -------------- Resize Tour/Product Images -------------- */
exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    /** Cover Image */
    req.body.imageCover = `tour-${req.params.tour_id}-${Date.now() - cover.jpeg}`

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    /** Tour Images */
    req.body.images = [];

    await Promise.all(req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.tour_id}-${Date.now()}-${i + 1}.jpeg}`

        await sharp(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
    })
    );

    next();
});