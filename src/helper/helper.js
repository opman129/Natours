const ApiFeatures = require('../utils/ApiFeatures');
const errorHandler = require("../utils/errorHandler");
const responseHandler = require("../utils/responseHandler");

exports.deleteOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) return errorHandler(404, `The document with the given Id not found`);
        return responseHandler(res, null, next, 200, `Document deleted successfully`);
    } catch (error) {
        return res.status(500).json({ message: 'Fail', error: error.message });
    };
};

exports.updateOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true
        });
        if (!doc) return errorHandler(404, `The document with the given Id not found`);
        return responseHandler(res, doc, next, 200, `Document updated successfully`);
    } catch (error) {
        return res.status(500).json({ message: 'Fail', error: error.message });
    };
};

/** Fetch All Documents */
exports.find = (Model) => async (req, res, next) => {
    try {
        const features = new ApiFeatures(Model.find().lean(), req.query)
            .filter()
            .sort()
            .limit()
            .paginate();

        const doc = await features.query;
        const message = 'Documents retrieved successfully';
        return responseHandler(res, doc, next, 200, message, doc.length);
    } catch (error) {
        return res.status(500).json({ message: 'Fail', error: error.message });
    };
};

/** Find One Document */
exports.findOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findById(req.params.id).lean();
        if (!doc) return errorHandler(404, `The document with the given Id not found`);
        return responseHandler(res, doc, next, 200, 'Document retrieved successfully', 1);
    } catch (error) {
        return res.status(500).json({ message: 'Fail', error: error.message });
    };
};

exports.createOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.create(req.body);
        const message = "Created successful";
        return responseHandler(res, doc, next, 200, message, 1);
    } catch (error) {
        return res.status(500).json({ message: 'Fail', error: error.message });
    }
}