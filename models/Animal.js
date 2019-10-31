const Schema = require("mongoose").Schema;

const Animal = Schema({
    name: String,
    species: String,
    age: Number,
    gender: String,
    activity: String
})


module.exports = db.model('Animal', Animal)