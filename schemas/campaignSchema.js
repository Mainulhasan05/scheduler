const mongoose = require("mongoose");
const contact_listSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    emails: [
        {
            type: Object,
        }
    ],
    body: {
        type: String,
    },
    subject: {
        type: String,
    },
    
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    elementCount: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    },
    openCount: {
        type: Number,
        default: 0
    },
    clickCount: {
        type: Number,
        default: 0
    },
    unsubscribeCount: {
        type: Number,
        default: 0
    },


}, { timestamps: true })

const User = new mongoose.model("campaign", contact_listSchema);
module.exports = User
