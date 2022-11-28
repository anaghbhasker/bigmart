const express  = require('express');
const router = express.Router()
const userController = require('../controllers/userController')
const shopController = require('../controllers/shopController')
const cartController =require('../controllers/cartController')
const checkoutController=require('../controllers/checkoutController')
const profileController=require('../controllers/profileController')
const authmiddleware = require('../middlewares/authmiddleware')
router.use(express.static("public/user"))



///////////////////////////////////////////////////////////

router.get('/',userController.homepage)
router.get('/usersignup',userController.signuppage)
router.get('/userlogin',userController.loginpage)
router.get('/getotp',userController.getOtppage)
router.post('/postOtp',userController.postOtp)
router.get('/resendOtp',userController.resendOtp)



///////////////////////////////////////////////////////////

router.post('/signup',userController.userpostsignup)
router.post('/login',userController.userpostLogin)
router.get('/logout',userController.userLogout)

///////////////////////////////////////////////////////////

router.get('/productQuickview',userController.productquickview)

///////////////////////////////////////////////////////////

router.get('/shopPage',shopController.shopPage)
router.get('/getCategory',shopController.getProduct)
router.get('/productDetail',shopController.productDetail)

///////////////////////////////////////////////////////////

router.get('/wishlist',authmiddleware.checkUserAuth,shopController.wishList)
router.get('/addWishlist',shopController.addWishlist)
router.get('/removewishlist',shopController.removeWishlist)

///////////////////////////////////////////////////////////

router.get('/cartlist',authmiddleware.checkUserAuth,cartController.cartPage)
router.get('/addCart',cartController.addCart)
router.get('/removecart',cartController.removeCart)
router.post('/qtyincre',cartController.qudtyIncre)

///////////////////////////////////////////////////////////

router.get('/checkout',checkoutController.checkoutPage)
router.post('/addAddress',checkoutController.addAddress)
router.get('/removeAddress',checkoutController.removeAddress)
router.post('/placeorder',checkoutController.placeOrder)
router.post('/verify-payment',checkoutController.verifyPayment)
router.get('/thankyou',checkoutController.thankYoupage)


router.post('/coupenApply',checkoutController.coupenapply)


///////////////////////////////////////////////////////////

router.get('/account',profileController.accountPage)
router.post('/editProfile',profileController.editProfile)
router.get('/cancelOrder',profileController.cancelOrder)





module.exports = router