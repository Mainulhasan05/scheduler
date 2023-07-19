const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    emails:{
        type:Array,
        default:[]
    },
    role:{
        type:String,
    }
},{timestamps:true})

const User=new mongoose.model("user",userSchema);
module.exports= User
