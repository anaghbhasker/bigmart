
const User = require("../model/userSchema");

module.exports.checkAdminAuth = async(req,res,next) => {
   
    let session = req.session.adminLogged
    if(session){
        next()
    }
    else if(!session){
        res.redirect('/admin/login')
    }
}

module.exports.checkUserAuth = async(req,res,next) => {
    
    let session = req.session.userLogged
    if(session){
        next()
    }
    else if(!session){
        
        res.json({status:'success'})
        
    }

}


module.exports.checkAUserSNDAuth = async(req,res,next) => {
   
    let session = req.session.userLogged
    if(session){
        const userBlockId = req.session.userKO
        const block=await User.findById(userBlockId)
        if (block.isBanned===false) {
            next()
        } else {
            res.redirect('/userlogin')
        }
    }
    else if(!session){
        res.redirect('/userlogin')
    }
}