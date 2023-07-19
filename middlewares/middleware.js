const jwt=require('jsonwebtoken');
const User=require("../schemas/userSchema");



const verifyToken=async(req,res,next)=>{
    console.log("verify token")
    if(!req.headers.cookie){
        return res.status(401).send("Access Denied");
    }
    try{
        const token=req.headers.cookie.split("=")[1];
        const verified=jwt.verify(token,process.env.TOKEN_SECRET);
        // console.log(verified);
        req.user=verified;
        const user=await User.findOne({_id:verified._id});
        // console.log(user);
        if(!user){
            return res.status(400).send("User not found");
        }
        next();
    }catch(err){
        res.status(400).send("Invalid Token");
    }
}


module.exports={
    verifyToken
}