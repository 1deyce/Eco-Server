const mongoose = require("mongoose");
const { Schema } = mongoose;

const LocationSchema = new Schema({
        name: {
            type: String,
        },
        address: {
            type: String,
        }
    }, { timestamps: true }
);

const LocationModel = mongoose.model("locations", LocationSchema);

module.exports = LocationModel;