const Animal = require("../models/Animal")

module.exports = {

    // This should return back a list of animals and a list of species
    getAnimals: (req, res) => {
        console.log("Getting Animals")
        Animal.find()
            .then(dbAnimals => {

                // Must find out how this works later on
                let species = dbAnimals.map(animal => animal.species).filter((value, index, self) => self.indexOf(value) === index)
                let animalData = {
                    animals: dbAnimals,
                    species: species
                }
                res.json(animalData)
            })
    },

    // Return animals based off the params
    getSpecies: (req, res) => {
        console.log("Getting animals by species")
        console.log(req.params.species)

        if (req.params.species === 'All') {
            Animal.find()
                .then(dbAnimals => {
                    res.json(dbAnimals)
                })
        } else {
            Animal.find({ 'species': req.params.species })
                .then(dbAnimals => {

                    console.log(dbAnimals)
                    res.json(dbAnimals)

                })

        }
    },

    addAnimal: (req, res) => {
        console.log("Animal is being added to zoo")
        Animal.create(req.body)
            .then(dbAnimal => {

                res.json(dbAnimal)
            })
    },

    editAnimal: (req, res) => {
        console.log("Animal is being edited")
        console.log(req.boyd.id)
        Animal.findByIdAndUpdate(req.body.id, {
            name: req.body.name,
            age: req.body.age,
            species: req.body.species,
            gender: req.body.gender
        })
            .then(dbAnimal => {
                console.log("Animal Updated")
                res.json(dbAnimal)
            })
    },

    removeAnimal: (req, res) => {
        console.log("Animal is being removed :(")
        console.log(req.params.id)
        Animal.findByIdAndDelete(req.params.id)
            .then(dbAnimal => {
                console.log("\nAnimal Deleted")
                res.json(dbAnimal)
            })
    }
}