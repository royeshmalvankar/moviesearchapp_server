import express from "express";
import  UserModel  from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.middleware.js";
import BlacklistModel from "../model/blacklist.js";

const  userRoute = express.Router();

userRoute.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = await UserModel.findOne({email});
    if(user){
       return res.json({message:"user already registered"});
    }    
  try {
      bcrypt.hash(password, 8, async (err, hash) => {
          if(err){
              return res.json({message:"something went wrong by hashing password",error:err});
          }
          const user = new UserModel({
              name,
              email,
              password: hash,
              role
          });
              await user.save();
              res.json({message:"user created successfully"});
      })
  } catch (error) {
      res.json({message:"something went wrong",error:error});
  }
})


userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({email});
    
   try {
     if(user){
         bcrypt.compare(password, user.password, (err, result) => {
             if(err){
                 res.json({message:"something went wrong by comparing password",error:err});
             }
             if(result){
                 const token = jwt.sign({ role:user.role,id:user._id}, process.env.Key);
                 res.json({message:"login successfully",token:token});
             }else{
                 res.json({message:"wrong password"});
             }
         })
 
     }else{
         res.json({message:"user not found please register first"});
     }
   } catch (error) {
       res.json({message:"something went wrong",error:error});
   }
})

userRoute.get("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const black = new BlacklistModel({token})
        await black.save()
        res.status(200)
        res.send({"message":"you are logged out"})
    } catch (error) {
        res.status(400).json({"message":error})
    }
   
})

userRoute.get("/profile",verifyToken, async (req, res) => {
    const user = await UserModel.find({_id:req.user.id});
    res.json({user});
})




export default userRoute