const Animal = require("../models/Animal")

module.exports = {

    // $gt = greater and then designate an amount to be greater than
    // $inc = increase and then designate an amount to increase by

    // I may also use classes to create new animals!

    increaseAge: (req, res) => {
        console.log("Increase age of animal")
        console.log(req.params.id)
        Animal.updateOne(
            { _id: req.params.id },
            { $inc: { age: 1 } })
            .then(dbAnimals => {
                console.log("Increased Animal Age")
                res.send(dbAnimals)
            })
    }
}