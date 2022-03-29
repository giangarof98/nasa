const LaunchesDB = require('./launches.mongo')
const Planets = require('./planets.mongo')

const defaultNumber = 1000;

const launch = {
    flightNumber: 100,
    mission: 'Kepler exploration',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customer: ['Gigawebdev'],
    upcoming: true,
    success: true,
};

saveLaunch(launch)

async function existsLaunchWithId(launchId){
    return await LaunchesDB.findOne({
        flightNumber: launchId,
    })
}

async function getLatestFlightNumber(){
    const latestLaunch = await LaunchesDB
        .findOne()
        .sort('-flightNumber');
    
    if(!latestLaunch){
        return defaultNumber;
    }

    return latestLaunch.flightNumber;
}

async function getAllLaunches(){
    return await LaunchesDB
        .find({},{'_id':0, '__v':0} );
}

async function saveLaunch(launch){
    const planet = await Planets.findOne({
        keplerName: launch.target
    });
    if(!planet){
        throw new Error('No planet found')
    }
    await LaunchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLauch(launch){
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['Gigawebdev'],
        flightNumber: newFlightNumber
    })
    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){
    const aborted = await LaunchesDB.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    return aborted.modifiedCount === 1;
}



module.exports = {
    getAllLaunches,
    existsLaunchWithId,
    scheduleNewLauch,
    abortLaunchById
}