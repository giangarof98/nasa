const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');

const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT || 8000;

const mongoUrl = `mongodb+srv://nasa-api:o0Oxzw8O2UZtFRL7@nasacluster.bzkml.mongodb.net/Nasa?retryWrites=true&w=majority`

const server = http.createServer(app);

mongoose.connection.on('open', () => {
    console.log('Mongo Connection Open')
})

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function startServer(){
    await mongoose.connect(mongoUrl)
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Serving on port ${PORT}`)
    })
}

startServer()