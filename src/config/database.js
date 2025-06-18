const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ceebee:namastenode@namastenode.0powykm.mongodb.net/devTinder');
}

module.exports = connectDB;