const router=require("express").Router();
const {verifyToken}=require("../middlewares/middleware")
const {registerController,
    loginController,
getUserController}=require("../controllers/auth_controllers")

const {handleSchedule} = require("../controllers/scheduler_controllers");




router.post("/register",registerController)
router.post("/login",loginController)
// router.get("/get_user",verifyToken,getUserController)
router.get("/get_user",getUserController)

// 


module.exports=router;