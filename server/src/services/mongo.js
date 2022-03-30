const mongoose = require("mongoose")
const mongoUrl = `mongodb+srv://nasa-api:o0Oxzw8O2UZtFRL7@nasacluster.bzkml.mongodb.net/Nasa?retryWrites=true&w=majority`

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