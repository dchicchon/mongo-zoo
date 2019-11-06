const Schema = require("mongoose").Schema;

const Animal = Schema({
    name: String,
    age: Number,
    species: String,
    gender: String,
    activity: String,
    birthday: String,
    hunger: Number,
    stamina: Number,
    happy: Number
})


module.exports = db.model('Animal', Animal)