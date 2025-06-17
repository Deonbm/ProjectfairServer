const users=require('../Model/userModel')
const jwt=require('jsonwebtoken')

exports.registerController=async(req,res)=>{
    console.log('inside registerController');
    
    const{username,email,password}=req.body
    console.log(req.body);
    
    console.log(username,email,password);

    try{
        const existingUser=await users.findOne({email})
        
        if (existingUser) {
            res.status(406).json('user already exists...please login')
        } else {
            const newUser=new users({username,email,password,github:"",linkedin:"",profilePic:""})
            
            await newUser.save()
            res.status(200).json(newUser)
        }
    }
    catch(err){
        res.status(401).json(err)

    }

    
}

exports.loginController=async(req,res)=>{
    console.log("inside loginConttroller");
    try {
        const{email,password}=req.body
        console.log(email,password);
        

        const existingUser=await users.findOne({email,password})
        console.log(existingUser);
        
        if (existingUser) {
            const token=jwt.sign({userId:existingUser._id},process.env.JWT_PASSWORD)
            res.status(200).json({user:existingUser,token})
        }else{
            res.status(404).json('invalid email/password')

        }

    } catch (error) { 
        res.status(401).json(error)
        
    }
}

exports.updateProfileController= async(req,res)=>{
    console.log("inside updateProfileController");
    
    const userId=req.userId

    const{username,email,password,github,linkedin,profilePic}=req.body
    const uploadImg=req.file?req.file.filename:profilePic

    try {

        const updatedProfile=await users.findByIdAndUpdate({_id:userId},{username,email,password,github,linkedin,profilePic:uploadImg},{new:true})
        await updatedProfile.save()
        res.status(200).json(updatedProfile)
    } catch (error) {
        res.status(401).json(error)
    }


}