const mongoose = require("mongoose");
const templateSchema = new mongoose.Schema({
    subject: {
        type: String,
    },
    body: {
        type: String,
        required: true,
        unique: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true })

const Template = new mongoose.model("template", templateSchema);
module.exports = Template
