const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URI, () => {
        console.log("Connection Successful");
    })
}

module.exports = connectDB;