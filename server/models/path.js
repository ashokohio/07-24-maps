const mongoose = require("mongoose")

const pointSchema = new mongoose.Schema({
    elevation: {
        type: Number,
        required: true
    },
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    resolution: {
        type: Number,
        required: true
    }
})

const pathSchema = new mongoose.Schema({
    points: [pointSchema]
})

module.exports = mongoose.model("Path", pathSchema)