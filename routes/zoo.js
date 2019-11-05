const router = require("express").Router();

// Created a seperate controller to modify animal database
const zooController = require("../controllers/zooController")
const animalController = require("../controllers/animalController");

router.route("/")
    .get(zooController.getAnimals)
    .post(zooController.addAnimal)
    .put(zooController.editAnimal)

router.route("/time")
    .get(zooController.getTime)
    .post(zooController.createTime)
    .put(zooController.updateTime)

router.route("/:species")
    .get(zooController.getSpecies)

router.route("/increaseAge/:id")
    .put(animalController.increaseAge)

router.route("/:id")
    .delete(zooController.removeAnimal)

module.exports = router;