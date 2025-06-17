const projects=require('../Model/projectModel')

exports.addProjectController=async(req,res)=>{
    console.log("inside addProjectController");
    const userId=req.userId
    console.log(userId);
    const{title,languages,github,website,overview}=req.body
    const projectimg=req.file.filename

    try {
        const existingProject=await projects.findOne({github})
        if (existingProject) {
            res.status(406).json('project already added...please add another one')
        }else{
            const newProject= new projects({title,languages,github,website,overview,projectimg,userId})
            await newProject.save()
            res.status(200).json(newProject)
        }

        
    } catch (error) {
        res.status(401).json(error)
    }    

    
}

exports.getHomeProjectController=async(req,res)=>{
    console.log("inside getHomeProjectController");
    
try {
    
    const homeProjects=await projects.find().limit(3)
    res.status(200).json(homeProjects)

} catch (error) {
    res.status(401).json(error)
}

}


exports.getAllProjectController=async(req,res)=>{
    console.log("inside getAllProjectController");

    const {search}=req.query
    
try {

    const query={
       languages:{
            $regex:search,
            $options:'i'
        }
    }
    
    const allProjects=await projects.find(query)
    res.status(200).json(allProjects)

} catch (error) {
    res.status(401).json(error)
}

}


exports.getUserProjectController=async(req,res)=>{
    console.log("inside getUserProjectController");
    
    const userId =req.userId
try {
    
    const userProjects=await projects.find({userId})
    res.status(200).json(userProjects)

} catch (error) {
    res.status(401).json(error)
}

}


exports.updateProjectController=async(req,res)=>{
    console.log('inside updateProjectController');

    const{pid}=req.params
    const{title,languages,github,website,overview,projectimg}=req.body
    const uploadImg=req.file?req.file.filename:projectimg
    const userId=req.userId

    try {
        const updatedProject=await projects.findByIdAndUpdate({_id:pid},{title,languages,github,website,overview,projectimg:uploadImg},{new:true})
        await updatedProject.save()
        res.status(200).json(updatedProject)
    } catch (error) {
        res.status(401).json(error)
    }
    
}

exports.removeProjectController=async(req,res)=>{
    console.log('inside removeProjectController');
   
    const{id}=req.params
try
    {const removeProject =await projects.findByIdAndDelete({_id:id})
    res.status(200).json(removeProject)}
    catch(err){
     res.status(401).json
    }
}


