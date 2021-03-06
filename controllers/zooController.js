const Animal = require("../models/Animal")
const Time = require("../models/Time")

const nameGenerator = (sex) => {
    if (sex === 'Male') {
        let namesArr = [`James`, `Reese`, `Josh`, `Jackson`, `Isaiah`, `Cooper`, `Bryan`];
        return namesArr[Math.floor(Math.random() * namesArr.length)]

    } else {
        let namesArr = [`Leah`, `Andrea`, `Jacky`, `Gilda`, `Cathy`, `Harper`, `Betty`]
        return namesArr[Math.floor(Math.random() * namesArr.length)]
    }
}

module.exports = {

    ////////////////////// 
    /// TIME FUNCTIONS ///
    ////////////////////// 
    getTime: (req, res) => {
        console.log("Getting Time")
        Time.find()
            .then(dbTime => {
                console.log("Got Time")
                console.log(dbTime)
                res.json(dbTime)
            })
    },

    createTime: (req, res) => {
        // console.log(req.body)
        Time.create(req.body)
            .then(dbTime => {
                // console.log("Time created")
                // console.log(dbTime)
                res.json(dbTime)
            })
    },

    updateTime: (req, res) => {
        let { seconds, minutes, days, season, year } = req.body
        Time.updateOne({ _id: req.body._id }, { $set: { seconds, minutes, days, season, year } })
            .then(dbTime => {
                res.json(dbTime)
            })
    },


    ////////////////////// 
    /// ZOO FUNCTIONS ///
    ////////////////////// 

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

    // Adding animal to zoo. For some reason if I don't move the selection, species in undefined
    addAnimal: (req, res) => {
        let { species } = req.body
        if (!species) {
            species = 'Bat'
        }

        let sexArr = ['Male', "Female"];
        let sex = sexArr[Math.floor(Math.random() * sexArr.length)];

        let activityArr = ['Sleeping', 'Eating', 'Playing'];
        let activity = activityArr[Math.floor(Math.random() * activityArr.length)];

        // Add randomizer for name, gender, and activity
        let newAnimal = {
            name: nameGenerator(sex),
            age: (Math.floor(Math.random() * 10) + 1),
            species,
            // Change this to sex later
            sex,
            activity: activity,
            hunger: 50,
            stamina: 50,
            happy: 50
        }

        // have a randomizer function here to generate an animal
        Animal.create(newAnimal)
            .then(dbAnimal => {
                // But what if I also wanted to return a list of all the animals back?
                console.log("Animal Created")
                console.log(dbAnimal)
                // res.json(dbAnimal)
                Animal.find()
                    .then(dbAnimals => {
                        let species = dbAnimals.map(animal => animal.species).filter((value, index, self) => self.indexOf(value) === index)
                        let animalData = {
                            animals: dbAnimals,
                            species
                        }
                        res.json(animalData)
                    })
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
    },


    // May create new controller just for modifying animals age and behavior
    // $gt = greater and then designate an amount to be greater than
    // $inc = increase and then designate an amount to increase by

    // I may also use classes to create new animals!

    // increaseAge: (req, res) => {
    //     console.log("Increase age of all the animals")
    //     Animal.updateMany(
    //         { age: { $gt: -1 } },
    //         { $inc: { age: 1 } })
    //         .then(dbAnimals => {
    //             console.log("Increased Animal Age")
    //             res.send(dbAnimals)
    //         })
    // }
}