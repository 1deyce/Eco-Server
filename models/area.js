const mongoose = require("mongoose");
const { Schema } = mongoose;

const AreaSchema = new Schema({
        name: {
            type: String,
        },
        description: {
            type: String,
        }
    }, { timestamps: true }
);

const AreaModel = mongoose.model("areas", AreaSchema);

module.exports = AreaModel;