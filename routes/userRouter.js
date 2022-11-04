const express  = require('express');
const router = express.Router()
const userController = require('../controllers/userController')
router.use(express.static("public/user"))




router.get('/',userController.homepage)
router.get('/usersignup',userController.signuppage)
router.get('/userlogin',userController.loginpage)

router.post('/signup',userController.userpostsignup)
router.post('/login',userController.userpostLogin)
router.get('/logout',userController.userLogout)


module.exports = router