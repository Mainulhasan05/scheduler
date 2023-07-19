const mongoose = require("mongoose");
const contact_listSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    emails:[
        {
            type: mongoose.Types.ObjectId,
            ref: "email"
        }
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    elementCount: {
        type: Number,
        default: 0
      }
    

}, { timestamps: true })

const User = new mongoose.model("contact_list", contact_listSchema);
module.exports = User
