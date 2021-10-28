const Tour = require('../models/tour');
const responseHandler = require('../utils/responseHandler');
const errorHandler = require('../utils/errorHandler');
const { DateTime } = require('luxon');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');
require('dotenv').config({ path: './.env' });

class TourController {
    static async createTour (req, res, next) {
        try {
            const created_at = DateTime.now().toBSON();
            const { title, duration, maxGroupSize, difficulty, ratingsAverage,
                    price, discount, summary, description,
                    imageCover, images, startDates, secretTour } = req.body;

            const tour = await Tour.create({ title, duration, maxGroupSize, difficulty, ratingsAverage,
                price, discount, summary, description,
                imageCover, images, startDates, created_at, secretTour });
            const message = 'Tour created successfully';

            return responseHandler(res, tour, next, 201, message, 1);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Fetch All Tours */
    static async getTours (req, res, next) {
        try {
            const features = new ApiFeatures(Tour.find().lean(), req.query)
                .filter()
                .sort()
                .limit()
                .paginate();
            const tours = await features.query
            /** N/B: You can use .explain() to get details about a query from the database */

            const record = tours.length;
            if (record < 0) {
                return errorHandler(404, 'No Tours Found');
            };
    
            console.log(req.query);
            const message = "Tours retrieved successfully";
            return responseHandler(res, tours, next, 200, message, record);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Fetch A Tour */
    static async getTour (req, res, next) {
        try {
            const query = { _id: req.params.tour_id };
            const tour = await Tour.findOne(query).populate('reviews', '_id review rating user -tour');
            if(!tour) {
                return errorHandler(404, "Tour with the given Id does not exist");
            };
            const message = "Tour retrieved successfully";
            return responseHandler(res, tour, next, 200, message, 1);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Update Tour */
    static async updateTour (req, res, next) {
        try {
            const query = { _id: req.params.tour_id };
            const tour = await Tour.findOneAndUpdate(query, req.body,
                { new: true, runValidators: true });

            if (!tour) {
                return errorHandler(404, 'Tour with the given Id does not exist')
            };
            const message = 'Tour Updated successfully';

            return responseHandler(res, tour, next, 200, message, 1);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Delete Tour */
    static async deleteTour (req, res, next) {
        try {
            const query = { _id: req.params.tour_id };
            const tour = await Tour.findOneAndDelete(query);

            if (!tour) {
                return errorHandler(404, 'Tour with the given Id does not exist')
            };
            const message = 'Tour deleted successfully';
            
            return responseHandler(res, null, next, 200, message);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Aggregation Pipeline To Find Fetch All Tour Stats */
    static async getTourStats (req, res, next) {
        try {
            const stats = await Tour.aggregate([
                {
                    $match: { ratingsAverage: { $gte: 4.5 } }
                },
                {
                    $group: {
                        _id: '$difficulty',
                        numTours: { $sum: 1 },
                        numRatings: { $sum: '$ratingsQuantity' },
                        avgRating: { $avg: '$ratingsAverage' },
                        avgPrice: { $avg: '$price' },
                        minPrice: { $min: '$price' },
                        maxPrice: { $max: '$price' }
                    }
                },
                /** Sort Aggregate Pipeline by a Field in the returned Objects */
                {
                    $sort: { avgPrice: 1 }
                }
            ]);
            const message = 'Tour stats retrived successfully';
            return responseHandler(res, stats, next, 200, message, stats.length);
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        };
    };

    /** Aggregation Pipeline - Monthly Plan for tours */
    static async getMonthlyPlan (req, res, next) {
        try {
            const year = Number(req.params.year);
    
            const plan = await Tour.aggregate([
                {
                    $unwind: '$startDates'
                },
                {
                    $match: {
                        startDates: {
                            $gte: new Date(`${year}-01-01`),
                            $lte: new Date(`${year}-12-31`)
                        }
                    }
                },
                {
                    $group: {
                        _id: { $month: '$startDates' },
                        numTourStarts: { $sum: 1 },
                        tours: { $push: '$title' }
                    }
                },
                {
                    $addFields: { month: '$_id' }
                },
                {
                    $sort: { numTourStarts: -1 }
                },
                {
                    $limit: 12
                },
            ]);
    
            const message = 'Tour monthly data retrieved successfully';
            const record = plan.length;
    
            return responseHandler(res, plan, next, 200, message, record);
        } catch (error) {
            return res.status(400).json({ success: 'fail', err: error.message});
        };
    };

    /** Geospatial Query controller function */
    static async getTourWithin (req, res, next) {
        try {
            const { distance, latlng, unit } = req.params;
            const [lat, lng] = latlng.split(',');
            const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

            if (!lat || !lng) return errorHandler(400, "Please provide a latitude and longitude");

            const tours = await Tour.find({ 
                startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });
            return responseHandler(res, tours, next, 200, 'Tours closest to you retrieved successfully', tours.length);
        } catch (error) {
            return res.status(400).json({ success: 'fail', err: error.message});
        };
    };
};

module.exports = TourController; 