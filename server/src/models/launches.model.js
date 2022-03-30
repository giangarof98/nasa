const axios = require('axios');
const LaunchesDB = require('./launches.mongo')
const Planets = require('./planets.mongo')

const defaultNumber = 100;

const SpaceX_Url = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunches(){
    const response = await axios.post(SpaceX_Url, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });

    if(response.status !== 200){
        console.log('Problem downloading launch data')
        throw new Error('Launch data download failed')
    }


    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }
        console.log(`${launch.flightNumber}, ${launch.mission}`);
        
        await saveLaunch(launch)

    }
}

async function loadLaunchData(){
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if(firstLaunch){
        console.log('Launch Data already loaded');
    } else{
        await populateLaunches()
    }
    console.log('downloading launch data');  
}

async function findLaunch(filter){
    return await LaunchesDB.findOne(filter);
}



async function existsLaunchWithId(launchId){
    return await findLaunch({
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

async function getAllLaunches(skip, limit){
    return await LaunchesDB
        .find({},{'_id':0, '__v':0})
        .sort({flightNumber: 1})
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch){
    await LaunchesDB.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLauch(launch){
    const planet = await Planets.findOne({
        keplerName: launch.target
    });
    if(!planet){
        throw new Error('No planet found')
    }
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
    abortLaunchById,
    loadLaunchData
}