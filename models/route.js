const mongoose = require("mongoose");
const { Schema } = mongoose;

const RouteSchema = new Schema({
        name: {
            type: Number,
        },
        startAddress: {
            lat: {
                type: String,
            },
            lng: {
                type: String
            },
        },
        endAddress: {
            lat: {
                type: String,
            },
            lng: {
                type: String
            },
        },
    }, { timestamps: true }
);

const RouteModel = mongoose.model("routes", RouteSchema);

module.exports = RouteModel;