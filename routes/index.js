const router = require("express").Router();
const zooRoutes = require("./zoo");
const path = require("path");

router.use("/api", zooRoutes)

router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../client/public/index.html"))
})

module.exports = router