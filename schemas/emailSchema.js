const mongoose = require("mongoose");
const emailSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Active"
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true })

const User = new mongoose.model("email", emailSchema);
module.exports = User
