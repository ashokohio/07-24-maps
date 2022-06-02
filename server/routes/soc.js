const express = require("express")
const router = express.Router()
const Value = require("../models/value")

// Getting all
router.get("/", async (req, res) => {
    console.log("here");
    try {
        const values = await Value.find()
        res.json(values)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one
router.get("/:id", getValue, (req, res) => {
    res.json(res.value)
})

// Creating one
router.post("/", async (req, res) => {
    const value = new Value({
        data: {
            points: req.body.data.points,
            polyline: req.body.data.polyline
        }
    })

    try {
        const newValue = await value.save()
        res.status(201).json(newValue)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one
router.patch("/:id", getValue, async(req, res) => {
    if (req.body.data.points != null) {
        res.value.data.points = req.body.data.points
    }
    if (req.body.data.polyline != null) {
        res.value.data.polyline = req.body.data.polyline
    }
    
    try {
        const updatedValue = await res.value.save()
        res.json(updatedValue)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete("/:id", getValue, async (req, res) => {
    try {
        await res.value.remove()
        res.json({ message: "Deleted value" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


async function getValue(req, res, next) {
    let value
    try {
        value = await Value.findById(req.params.id)
        if (value == null) {
            return res.status(404).json({ message: "Cannot find value" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.value = value
    next()
}


module.exports = router