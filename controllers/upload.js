const User = require("../schemas/userSchema");

const uploadEmailsController = async (req, res) => {
    try {
        console.log(req.body)
        res.status(200).json({
            "success": true,
            "msg": "Email added successfully"
        })
    } catch (error) {
        
    }
}

module.exports = {
    uploadEmailsController
}