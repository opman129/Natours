const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  let mongodb_url;
  process.env.NODE_ENV === "development"
    ? mongodb_url = process.env.MONGO_URI
    : mongodb_url = process.env.MONGO_PRODUCTION_URI;
  const conn = await mongoose.connect(mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDb Connected to ${conn.connection.host} successfully`);
};

module.exports = connectDB;
