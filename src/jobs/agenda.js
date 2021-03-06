const Agenda = require('agenda');
const os = require('os');
require('dotenv').config({ path: './.env' });

/** Create Configuration File That Connects To The Database */
const agenda = new Agenda({
    db: {
        address: process.env.MONGO_URI,
        collection: 'jobs',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },
    name: 'Tour Queue'
});

const jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(",") : [];

/** loop through the job_list folder and pass in the agenda instance to 
 * each job so that it has access to its API. */

jobTypes.forEach(type => {
    // the type name should match the file name in the jobs_list folder
    require('./jobs_list/' + type)(agenda);
});

if(jobTypes.length) {
    // if there are jobs in the jobsTypes array set up and start
    agenda.on('ready', async () => 
    await agenda.start());
};

async function graceful () {
    await agenda.stop(() => 
    process.exit(0));
};

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

module.exports = agenda;