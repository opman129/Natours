const Tour = require('../../models/tour');

module.exports = async function (agenda) {
    /**Every job document has nextRunAt property */
    agenda.define('Fetch All Tours', { priority: 'high', concurrency: 15, lockLifetime: 60000 }, async (job, done) => {
        console.log('Fetching tours');
        try {
            const { tour_id } = job.attrs.data;
            console.log(job.attrs.data)
            await Tour.findByIdAndUpdate({ _id: tour_id }, { $set: { difficulty: 'medium' }}).lean()
            // await Tour.find().sort('-createdAt');
            done();
            job.remove(function (err) {
                if (err) {
                    err.name = "fetchAllTours"
                    console.log(err);
                    return;
                }
                return;
            })
        } catch (error) {
            done();
            console.log(error);
        };
    });
};