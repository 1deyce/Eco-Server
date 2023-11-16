const mongoose = require("mongoose");
const { Schema } = mongoose;
const findOrCreate = require("mongoose-findorcreate@4.0.0");

const UserSchema = new Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            default: null,
        },
        avatar: {
            type: String,
            default: null
        },
        isConfirmed: {
            type: Boolean,
            default: false
        },
        confirmationToken: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

UserSchema.plugin(findOrCreate);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;