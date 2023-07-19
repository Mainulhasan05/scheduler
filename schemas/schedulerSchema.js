const mongoose = require("mongoose");
const contact_listSchema = new mongoose.Schema({
    status: {
        type: Boolean,
        default: false
    },
    mailSent: {
        type: Number,
        default: 0
    },
    campaign_id: {
        type: mongoose.Types.ObjectId,
        ref: "campaign"
    },
    rejected_emails: [
        {
            type: String,
        }
    ],
    schedule:{
        type: Object,
    },
    nextSchedule:{
        type: Date,
    },
    limit:{
        type: Number,
    },
    jobId:{
        type: String,
    },
    
    

}, { timestamps: true })

const User = new mongoose.model("schedule", contact_listSchema);
module.exports = User
