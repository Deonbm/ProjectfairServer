const users=require('../Model/userModel')
const jwt=require('jsonwebtoken')
const sgmail = require('@sendgrid/mail')

sgmail.setApiKey(process.env.SGKEY)

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

            console.log("to email")

            const emailFormat={
                to: email,
                from: process.env.EMAIL,
                subject: 'Registration Successful',
                html:
                `<h2>Hi ${username},</h2>
          <p>Thank you for registering with <b>MyApp</b>. We're excited to have you on board 🚀</p>
          <p>You can now log in using your email: <b>${email}</b></p>
          <br>
          <p>Best regards,<br/>The MyApp Team</p>`

            }
                        console.log("to email format created")

            console.log('Before sending email');
            

            try {
              await sgmail.send(emailFormat);
              console.log('Email sent successfully');
              res.status(200).json(newUser)
            } catch (err) {
              console.log('Error sending email:', err);
              res.status(403).json({ error: 'Error sending email' });
            }

            console.log('After sending email');

            
                         console.log("to email sent")

            
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
