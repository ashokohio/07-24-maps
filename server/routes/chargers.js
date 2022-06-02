const express = require("express")
const router = express.Router()
const Charger = require("../models/charger")

// Getting all
router.get("/", async (req, res) => {
    try {
        const chargers = await Charger.find()
        res.json(charger)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one
router.get("/:id", getCharger, (req, res) => {
    res.json(res.charger)
})

// Creating one
router.post("/", async (req, res) => {
    const charger = new Charger({
        // id: req.body.id,
        name: req.body.name,
        gps_coordinates: req.body.gps_coordinates,
        state: req.body.state,
        last_update: req.body.last_update
    })

    try {
        const newCharger = await charger.save()
        res.status(201).json(newCharger)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one
router.patch("/:id", getCharger, async (req, res) => {
    /*if (req.body.id != null) {
        res.charger.id = req.body.id
    }*/
    if (req.body.name != null) {
        res.charger.name = req.body.name
    }
    if (req.body.gps_coordinates != null) {
        res.charger.gps_coordinates = req.body.gps_coordinates
    }
    if (req.body.state != null) {
        res.charger.state = req.body.state
    }
    if (req.body.last_update != null) {
        res.charger.last_update = req.body.last_update
    }

    try {
        const updatedCharger = await res.charger.save()
        res.json(updatedCharger)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete("/:id", getCharger, async (req, res) => {
    try {
        await res.charger.remove()
        res.json({ message: "Deleted charger" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getCharger(req, res, next) {
    let charger
    try {
        charger = await Charger.findById(req.params.id)
        if (charger == null) {
            return res.status(404).json({ message: "Cannot find charger" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.charger = charger
    next()
}

module.exports = router