const Schema = require("mongoose").Schema;

const Time = Schema({
    seconds: Number,
    minutes: Number,
    days: Number,
    season: Number,
    year: Number
})


module.exports = db.model('Time', Time)