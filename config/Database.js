const mongoose = require("mongoose");
require("dotenv").config();

const connectWithDb = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true, // Corrected typo here
    })
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => {
        console.error("DB connection error:", err.message); // Improved error message
        process.exit(1); // Exit process if DB connection fails
    });
};

module.exports = connectWithDb;