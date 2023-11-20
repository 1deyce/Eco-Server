const mongoose = require("mongoose");
const { Schema } = mongoose;

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
        address: {
            streetDetails: {
                type: String,
                default: null,
            },
            province: {
                type: String,
                default: null,
            },
            country: {
                type: String,
                default: null,
            },
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

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;