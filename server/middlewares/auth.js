import userModel from "../models/user.js";

export const validateRegister = (req,res,next)=>{
    const{name,email,password} = req.body;
    if(!name) return res.status(400).json({err:"name is required"});
    if(!email) return res.status(400).json({err:"email is required"});
    if(!password) return res.status(400).json({err:"password is required"});

    next();
}

export const validateLogin = async(req,res,next)=>{
    const{email,password} = req.body;
    if(!email) return res.status(400).json({err:"email is required"});
    if(!password) return res.status(400).json({err:"password is required"});
    const userData = await userModel.findOne({email});

    if(!userData) return res.status(404).json({err:"User not found"});
    req.user = userData;
    next();
}