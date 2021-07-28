const mongoose = require("mongoose")

const stationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Station", stationSchema)