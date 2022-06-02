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
    },
    SoC_value: {
        type: Number,
        required: true
    },
    predictions: {
        type: Boolean,
        required: true
    }
})

const valueSchema = new mongoose.Schema({
    data: {
        points: [pointSchema],
        polyline: {
            type: String,
            required: true
        }
    }
})

module.exports = mongoose.model("Value", valueSchema)