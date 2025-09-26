const users=require('../Model/userModel')
const jwt=require('jsonwebtoken')
const nodemailer =require('nodemailer')

const transporter =nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL,
        pass:process.env.EPSW
    }
})

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

            const token=jwt.sign({userId:newUser._id},process.env.JWT_ACTIVATION_PSW)
            
        const activationlink=`https://projectfairserver-xgn6.onrender.com/activate/${token}`

            const emailFormat={
                from: process.env.EMAIL,
                to: email,
                subject: 'Registration Successful',
                html:
                `<h2>Hi ${username},</h2>
          <p>Thank you for registering with <b>MyApp</b>. We're excited to have you on board 🚀</p>
          <p>You can now log in using your email: <b>${email}</b></p>
          <p>Activate your account Now</p>
          <a href=${activationlink}>Activate Now</a>
          <br>
          <p>Best regards,<br/>The MyApp Team</p>`

            }

            transporter.sendMail(emailFormat,(err,info)=>{
              if(err){
                console.log('error occurred',err);
              }
              else{
                console.log('email sent',info.response);
                
              }
            })


            res.status(200).json({newUser,token})
        }
    }
    catch(err){
        res.status(401).json(err)

    }

    
}

exports.activationController=async(req,res)=>{
    console.log("inside activationController");
    
    const {token}=req.params

    try {
        const tokenverify=jwt.verify(token,process.env.JWT_ACTIVATION_PSW)

        const activateduser = await users.findByIdAndUpdate(
            tokenverify.userId,
            {Activation:1},
            {new:true}
        )
      
        if (!activateduser) {
          return  res.status(404).json('User not found')
            
        }

        res.redirect('https://projectfairrrr-bzwhl09ty-deons-projects-5ff7fed8.vercel.app/login?activated=1')  


    } catch (error) {
        console.log(error);
        res.status(401).json('invalid token')
        
    }
}


exports.loginController = async (req, res) => {
    console.log("inside loginController");
    try {
      const { email, password } = req.body;
  
      const existingUser = await users.findOne({ email });
      if (!existingUser) {
        return res.status(404).json("Invalid email/password");
      }
  
      if (existingUser.password !== password) {
        return res.status(404).json("Invalid email/password");
      }
  
      if (existingUser.Activation !== 1) {
        return res.status(401).json("Please activate your account from your registered email");
      }
  
      const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_PASSWORD);
      res.status(200).json({ user: existingUser, token });
  
    } catch (error) {
      console.error(error);
      res.status(500).json("Something went wrong");
    }
  };
  

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