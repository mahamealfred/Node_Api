const router=require("express").Router();
const User=require("../models/User");
const bcrypt=require("bcrypt");
const { validate } = require("../models/User");

//reguster
router.post("/register", async (req,res) =>{
    
    
  try {
    if (req.user) {
      return res.status(400).json({
        status: 400,
        message: "User with email already exists",
      });
    }
   
    const { username, email, password } = req.body;
    const salt =await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hashSync(password, salt);
   const user= await User.create({
      username,
      email,
      password:hashedPassword,
    
    });
    return res.status(200).json({
      status: 200,
      message: "User have been created",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }

    });
    
    router.post("/login", async (req,res) =>{
      try {
        const user=await User.findOne({email:req.body.email});
        !user && res.status(404).json("user not found");

        const validPassword =await bcrypt.compare(req.body.password ,user.password)
        !validPassword && res.status(400).json("wrong password");

        res.status(200).json({
          message:"Successfuly Login",
          data: user,
        })
      } catch (error) {
        return res.status(500).json({
          status: 500,
          message: error.message,
        });       
        
      }

    
    });

module.exports = router;