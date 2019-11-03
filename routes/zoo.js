const router = require("express").Router();
const zooController = require("../controllers/zooController")

router.route("/")
    .get(zooController.getAnimals)
    .post(zooController.addAnimal)
    .put(zooController.editAnimal)

router.route("/:species")
    .get(zooController.getSpecies)

router.route("/increaseAge")
    .put(zooController.increaseAge)

router.route("/:id")
    .delete(zooController.removeAnimal)

module.exports = router;