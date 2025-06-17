require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./Routes/router')
require('./Db/dbConnection')

const pfServer=express()
pfServer.use(cors())
pfServer.use(express.json())
pfServer.use(router)
pfServer.use('/uploads',express.static('./uploads'))

const PORT=3000 || process.env.PORT
pfServer.listen(PORT,()=>{
    console.log(`pfserver running successfully at port ${PORT}`);

})

pfServer.get('/',(req,res)=>{
    res.status(200).send(`<h1>Project fair server running at the port 3000 and
        waiting for client request</h1>`)
})
