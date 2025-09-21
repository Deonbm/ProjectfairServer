const express = require('express')
const userController=require('../controller/userController')
const projectController=require('../controller/projectController')
const jwtMiddleware=require('../middlewares/jwtMiddleware')
const multerMiddleware=require('../middlewares/multerMiddleware')

const router=new express.Router()

router.post('/register',userController.registerController)
router.get('/activate/:token',userController.activationController)
router.post('/login',userController.loginController)
router.post('/add-project',jwtMiddleware,multerMiddleware.single('projectimg'),projectController.addProjectController)
router.get('/get-home-projects',projectController.getHomeProjectController)
router.get('/get-all-projects',projectController.getAllProjectController)
router.get('/get-user-projects',jwtMiddleware,projectController.getUserProjectController)
router.put('/edit/project/:pid',jwtMiddleware,multerMiddleware.single('projectimg'),projectController.updateProjectController)
router.delete('/remove/project/:id',jwtMiddleware,projectController.removeProjectController)
router.put('/edit/profile',jwtMiddleware,multerMiddleware.single('profilePic'),userController.updateProfileController)
module.exports=router
    