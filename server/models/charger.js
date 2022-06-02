const mongoose = require("mongoose")

const chargerSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    gps_coordinates: {
        type: String,
        required: true
    },
    last_update: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Charger", chargerSchema)