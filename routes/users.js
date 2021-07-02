const router=require("express").Router();
const bcrypt=require("bcrypt");
const User=require("../models/User");

//update user
router.put("/:id",async(req,res) =>{
    if(req.body.userId === req.params.id || req.user.isAdmin){
        if(req.body.password){
            try{
                const salt=await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            }catch(error){
                return res.status(500).json(error);
            }
        }
        try {
            const user=await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
            
        } catch (error) {
            return res.status(500).json(error);   
        }
    }
    else{
        return res.status(403).json("you can update only your account!");
    }
});
//delete user
router.delete("/:id",async(req,res) =>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
       
        try {
            const user=await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted");
            
        } catch (error) {
            return res.status(500).json(error);   
        }
    }
    else{
        return res.status(403).json("you can delete only your account!");
    }
});
//get a user
router.get("/:id",async (req,res) =>{
    try {
    
        const singleUser = await User.findById(req.params.id);
        const {password,updatedAt, ...other}=singleUser._doc
        if (singleUser) {
          res.status(200).json({
            status: 200,
            message: "retrieved one user",
            data: other,
          });
        }
        res.status(404).json({
          status: 404,
          message: "user not  found",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: error.message });
      }
});
//follow a user
router.put("/:id/follow",async (req,res) =>{
    if(req.body.userId !== req.params.id){
        try {
            const user= await User.findById(req.params.id);
            const currentUser =await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers: req.body.userId}});
                await currentUser.updateOne({$push:{followings: req.params.id}});
                res.status(200).json("User has been followed");

            }else{
                res.status(403).json("You allready follow this user")
            }
            
        } catch (error) {
            res.status(500).json(error)
            
        }

    }else{
        res.status.length(403).json("you cant follow yourself");
    }

});
//unfollow a user
module.exports = router;