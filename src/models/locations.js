const mongoose = require('mongoose');

const locationSchema = mongoose.Schema({

});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;