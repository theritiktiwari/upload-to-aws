const mongoose = require('mongoose');

// Connect to the database
const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URI, () => {
        console.log("Connection Successful");
    })
}

module.exports = connectDB;