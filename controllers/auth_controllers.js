const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
    try {
        const { email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, "password": hashedPassword })
        const savedUser = await newUser.save();
        res.status(200).json({ "msg": "User added successfully" })

    } catch (error) {
        if (error.message.includes('duplicate')) {
            return res.status(400).json({
                "success": false,
                "msg": "Email Already Exists"
            })
        }
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const matchedUser = await User.findOne({ email });
        if (!matchedUser) {
            return res.status(400).json({
                "success": false,
                "msg": "User not found"
            })
        }
        const isMatched = await bcrypt.compare(password, matchedUser.password);
        if (!isMatched) {
            return res.status(200).json({
                "success": false,
                "msg": "Invalid Credentials"
            })
        }
        const token = jwt.sign({ _id: matchedUser._id }, process.env.TOKEN_SECRET);
        res.cookie("auth-token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 20 * 1000)
        }
        )
        res.header("auth-token", token).json({
            "success": true,
            "token": token
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const logoutController = async (req, res) => {
    try {
        res.cookie("auth-token", "", {
            httpOnly: true,
            maxAge: 0
        }
        )
        res.status(200).json({
            "success": true,
            "msg": "Logged out successfully"
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const getUserController = async (req, res) => {
    try {
        
        const {_id} = await decodeToken(req.headers.authorization);
        
        const user = await User.findOne({ _id: _id });
        res.status(200).json({
            "success": true,
            "user": user
        })
    } catch (error) {
        res.status(400).json({
            "success": false,
            "msg": "Error occured"
        })
    }
}

const decodeToken = async (token)=>{
    try {
        const decoded=jwt.verify(token,process.env.TOKEN_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

module.exports = {
    registerController,
    loginController,
    getUserController,
    logoutController,
    decodeToken
}