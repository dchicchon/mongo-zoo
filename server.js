const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose")

// MONGO CONNECTION
// Remember that this must be before you bring in route from ./routes to use in app.use(routes)
const URI = process.env.MONGODB_URI || "mongodb://localhost/zoo2";
global.db = mongoose.createConnection(URI, { useNewUrlParser: true, useUnifiedTopology: true });

if (process.env.NODE_ENV === 'production') {
    app.use(express.static("client/build"));
} else {
    app.use(express.static("client/public"));
}

// Allow JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json({}));

// Get Routes
const routes = require("./routes");
app.use(routes);

// Listen to PORT
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`)
})