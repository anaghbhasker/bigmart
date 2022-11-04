const express  = require('express');
const router = express.Router()
const adminController = require('../controllers/adminController')
const authmiddleware = require('../middlewares/authmiddleware')
const fileupload=require('../middlewares/fileuploadmiddleware')
router.use(express.static("public/admin"))




router.get('/',authmiddleware.checkAdminAuth,adminController.indexpage)
router.get('/userlist',authmiddleware.checkAdminAuth,adminController.userlist)
router.get('/products',authmiddleware.checkAdminAuth,adminController.products)
router.get('/addProducts',authmiddleware.checkAdminAuth,adminController.addProducts)
router.get('/category',authmiddleware.checkAdminAuth,adminController.category)
router.get('/orders',authmiddleware.checkAdminAuth,adminController.orders)
router.get('/salesreport',authmiddleware.checkAdminAuth,adminController.salesreport)
router.get('/coupens',authmiddleware.checkAdminAuth,adminController.coupens)
router.get('/banners',authmiddleware.checkAdminAuth,adminController.banners)

///////////////////////////////////////////////////////////

router.get('/login',adminController.admingetLogin)
router.post('/login',adminController.adminpostLogin)
router.get('/logout',adminController.adminLogout)

///////////////////////////////////////////////////////////

router.get('/blockUser',adminController.userBlock)
router.get('/unblockUser',adminController.userUnblock)

///////////////////////////////////////////////////////////

router.post('/addCategory',fileupload.upload.single('categoryimage'),adminController.addCategory)
router.get('/deleteCategory',adminController.deleteCategory)

///////////////////////////////////////////////////////////


router.post('/addProducts',fileupload.upload.single('productimage'),adminController.addPOSTroducts)
router.get('/deleteProduct',adminController.deleteProduct)








module.exports = router