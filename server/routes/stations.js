const express = require("express")
const router = express.Router()
const Station = require("../models/station")

// Getting all
router.get("/", async (req, res) => {
    try {
        const stations = await Station.find()
        res.json(stations)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one
router.get("/:id", getStation, (req, res) => {
    res.json(res.station)
})

// Creating one
router.post("/", async (req, res) => {
    const station = new Station({
        // id: req.body.id,
        name: req.body.name,
        location: {lat: req.body.location.lat, lng: req.body.location.lng},
        status: req.body.status
    })

    try {
        const newStation = await station.save()
        res.status(201).json(newStation)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one
router.patch("/:id", getStation, async (req, res) => {
    /*if (req.body.id != null) {
        res.station.id = req.body.id
    }*/
    if (req.body.name != null) {
        res.station.name = req.body.name
    }
    if (req.body.location != null) {
        if (req.body.location.lat != null) {
            res.station.location.lat = req.body.location.lat
        }
        if (req.body.location.lng != null) {
            res.station.location.lng = req.body.location.lng
        }
    }
    if (req.body.status != null) {
        res.station.status =req.body.status
    }

    try {
        const updatedStation = await res.station.save()
        res.json(updatedStation)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete("/:id", getStation, async (req, res) => {
    try {
        await res.station.remove()
        res.json({ message: "Deleted station" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getStation(req, res, next) {
    let station
    try {
        station = await Station.findById(req.params.id)
        if (station == null) {
            return res.status(404).json({ message: "Cannot find station" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.station = station
    next()
}

module.exports = router