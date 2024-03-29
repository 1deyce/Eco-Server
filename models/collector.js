const mongoose = require("mongoose");
const { Schema } = mongoose;

const CollectorSchema = new Schema({
        name: {
            type: String,
        },
    }, { timestamps: true }
);

const CollectorModel = mongoose.model("collectors", CollectorSchema);

module.exports = CollectorModel;