const LaunchesDB = require('./launches.mongo')
const Planets = require('./planets.mongo')
const launches = new Map();

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

function existsLaunchWithId(launchId){
    return launches.has(launchId)
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
    await LaunchesDB.updateOne({
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

function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}



module.exports = {
    getAllLaunches,
    existsLaunchWithId,
    scheduleNewLauch,
    abortLaunchById
}