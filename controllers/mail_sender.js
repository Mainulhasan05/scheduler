const {sendEmail} = require("../config/smtp_config");
const User = require("../schemas/userSchema");
const {decodeToken} = require("../controllers/auth_controllers");

const sendMail = async (req, res) => {
    try {

        const {email, subject, body} = req.body;
        const { _id } = await decodeToken(req.headers.authorization);
        // get user email
        const userEmail= await User.findOne({_id},{email:1});
        const result = await sendEmail(userEmail,email, subject, body);
        console.log(result);
        
        res.status(200).json({
            "success": true,
            "result": result
        })
    }
    catch (error) {
        res.status(400).json({
            "success": false,
            "msg": error.message
        })
    }
}

module.exports = {
    sendMail
}
