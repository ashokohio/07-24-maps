const express = require("express")
const router = express.Router()
const Path = require("../models/path")

// Getting all
router.get("/", async (req, res) => {
    try {
        const paths = await Path.find()
        res.json(paths)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Getting one
router.get("/:id", getPath, (req, res) => {
    res.json(res.path)
})

// Creating one
router.post("/", async (req, res) => {
    const path = new Path({
        points: req.body.points,
        polyline: req.body.polyline
    })

    try {
        const newPath = await path.save()
        res.status(201).json(newPath)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Updating one
router.patch("/:id", getPath, async(req, res) => {
    if (req.body.points != null) {
        res.path.points = req.body.points
    }
    if (req.body.polyline != null) {
        res.path.polyline = req.body.polyline
    }
    
    try {
        const updatedPath = await res.path.save()
        res.json(updatedPath)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Deleting one
router.delete("/:id", getPath, async (req, res) => {
    try {
        await res.path.remove()
        res.json({ message: "Deleted path" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


async function getPath(req, res, next) {
    let path
    try {
        path = await Path.findById(req.params.id)
        if (path == null) {
            return res.status(404).json({ message: "Cannot find path" })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.path = path
    next()
}


module.exports = router