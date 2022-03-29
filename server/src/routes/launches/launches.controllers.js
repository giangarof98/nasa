const express = require('express');
const {
    getAllLaunches, 
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLauch
} = require('../../models/launches.model');

async function httpgetAllLaunches(req,res){
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req,res) {
    const launch= req.body;

    if(!launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.target){
            return res.status(400).json({
                error: 'Missing required launch property'
            });
        }

    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: 'invalid launch date',
        });
    }
    await scheduleNewLauch(launch)
    return res.status(201).json(launch)
}

function httpAbortLaunch(req,res){
    const launchId = Number(req.params.id);
    if(!existsLaunchWithId(launchId)){
        return res.status(404).json({
            error: 'launch not found'
        });
    }

    const aborted = abortLaunchById(launchId)
    return res.status(200).json(aborted)
}

module.exports = {
    httpgetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}