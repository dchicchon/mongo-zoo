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

    getSpecies: (req, res) => {
        console.log("Getting animals by species")
        console.log(req.params.species)
        Animal.find()
            .then(dbAnimals => {

                // Use filter!
                if (req.params.species === 'All') {
                    res.json(dbAnimals)
                } else {
                    let species = dbAnimals.filter(animal => animal.species === req.params.species)
                    console.log("\nFound all animals in species")
                    console.log(species)
                    res.json(species)
                }
            })
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