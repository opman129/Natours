const Tour = require('../../models/tour');

module.exports = async function (agenda) {
    /**Every job document has nextRunAt property */
    agenda.define('Fetch All Tours', { priority: 20, concurrency: 15, lockLifetime: 60000 }, 
        async (job, done) => {
        console.log('Fetching tours');
        try {
            const { tour_id } = job.attrs.data;
            console.log(job.attrs.data);
            await Tour.findByIdAndUpdate(tour_id, { $set: { difficulty: 'medium' }}, 
                { new: true });
            
            done();
            job.remove(function (err) {
                if (err) {
                    err.name = "fetchAllToursError";
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