const mongoose =require('mongoose')

const userSchema=new mongoose.Schema({
username:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
},
github:{
    type:String 
},
linkedin:{
    type:String

},
profilePic:{
    type:String

},
Activation:{
    type: Number,
    enum:[0,1],
    default:0
}


})


const users=mongoose.model("users",userSchema)
module.exports=users