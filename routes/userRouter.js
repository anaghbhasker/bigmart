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

router.get('/forgotPassword',userController.lostPassword)
router.post('/changePassword',userController.changePass)
router.post('/postChangeOtp',userController.postchangeOtp)


///////////////////////////////////////////////////////////

router.get('/productQuickview',userController.productquickview)

///////////////////////////////////////////////////////////

router.get('/shopPage',shopController.shopPage)
router.get('/getCategory',shopController.getProduct)
router.get('/productDetail',shopController.productDetail)

///////////////////////////////////////////////////////////

router.get('/wishlist',authmiddleware.checkUserAuth,shopController.wishList)
router.get('/addWishlist',authmiddleware.checkAUserSNDAuth,shopController.addWishlist)
router.get('/removewishlist',authmiddleware.checkAUserSNDAuth,shopController.removeWishlist)

///////////////////////////////////////////////////////////

router.get('/cartlist',authmiddleware.checkUserAuth,cartController.cartPage)
router.get('/addCart',authmiddleware.checkAUserSNDAuth,cartController.addCart)
router.get('/removecart',authmiddleware.checkAUserSNDAuth,cartController.removeCart)
router.post('/qtyincre',authmiddleware.checkAUserSNDAuth,cartController.qudtyIncre)

///////////////////////////////////////////////////////////

router.get('/checkout',authmiddleware.checkAUserSNDAuth,checkoutController.checkoutPage)
router.post('/addAddress',authmiddleware.checkAUserSNDAuth,checkoutController.addAddress)
router.get('/removeAddress',authmiddleware.checkAUserSNDAuth,checkoutController.removeAddress)
router.post('/placeorder',authmiddleware.checkAUserSNDAuth,checkoutController.placeOrder)
router.post('/verify-payment',authmiddleware.checkAUserSNDAuth,checkoutController.verifyPayment)
router.get('/thankyou',authmiddleware.checkAUserSNDAuth,checkoutController.thankYoupage)


router.post('/coupenApply',authmiddleware.checkAUserSNDAuth,checkoutController.coupenapply)


///////////////////////////////////////////////////////////

router.get('/account',authmiddleware.checkAUserSNDAuth,profileController.accountPage)
router.post('/editProfile',authmiddleware.checkAUserSNDAuth,profileController.editProfile)
router.get('/cancelOrder',authmiddleware.checkAUserSNDAuth,profileController.cancelOrder)

///////////////////////////////////////////////////////////

router.post('/searchProduct',userController.searchproduct)





module.exports = router