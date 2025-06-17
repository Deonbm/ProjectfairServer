const jwt=require('jsonwebtoken')

const jwtMiddleware=(req,res,next)=>{
    
    console.log("inside jwt middleware");

    const token=req.headers['authorization'].split(" ")[1]
    console.log(token);
    
    
    if(token){
        try {
            const jwtResponse = jwt.verify(token,process.env.JWT_PASSWORD)
            console.log(jwtResponse);
            req.userId=jwtResponse.userId
            next() 
            
        } catch (error) {
            res.status(401).json("authorisation failed....please login")
        }

    }else{
        res.status(401).json("authorisation failed....token is missing")
    }
      

    
}

module.exports=jwtMiddleware