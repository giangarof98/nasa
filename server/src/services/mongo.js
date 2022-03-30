require('dotenv').config();
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;

mongoose.connection.on('open', () => {
    console.log('Mongo Connection Open')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function mongoConnect(){
    await mongoose.connect(mongoUrl)
}
async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}