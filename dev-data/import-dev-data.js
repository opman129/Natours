const fs = require('fs');
const dotenv = require('dotenv');
const User = require('../src/models/user');
const Tour = require('../src/models/tour');
const mongoose = require('mongoose');
dotenv.config({ path: './.env' });

let mongo_url;
process.env.NODE_ENV === 'development'
    ? mongo_url = process.env.MONGO_URI
    : mongo_url = process.env.MONGO_PRODUCTION_URI

mongoose
    .connect("mongodb://localhost:27017/natours-reloaded", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Db connection successful"))
    .catch((err) => console.log(err));

//Import Data into Database
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

/** Import into Database - Tours */
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log("Data Successfully loaded");
    } catch (error) {
        console.log(error)
    };
    process.exit();
};

/** Delete Data From Database - Tours */
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Data Deleted successfully");
    } catch (error) {
        console.log(error);
    };
    process.exit();
};

/**Import user data into database */
const importUsers = async () => {
    try {
        await User.create(users);
        console.log('Users imported successfully');
    } catch (error) {
        console.log(error);
    };
    process.exit();
};

/**Delete User data from database */
const deleteUsers = async () => {
    try {
        await User.deleteMany();
        console.log('User data deleted successfully');
    } catch (error) {
        console.log(error);
    };
    process.exit();
};

/** Call process.argv when importing and exporting by using the 
 * command node import-dev-data.js --import to IMPORT and
 * node import-dev-data.js --delete to delete data
 */
if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
};

/** Call process.argv when importing and exporting User data by using the 
 * command node import-dev-data.js --importUsers to IMPORT users and
 * node import-dev-data.js --deleteUsers to delete user data
 */
if (process.argv[2] === '--importUsers') {
    importUsers();
} else if (process.argv[2] === '--deleteUsers') {
    deleteUsers();
};

console.log(process.argv);