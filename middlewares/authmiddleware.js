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
   
    let session = req.session.adminLogged
    if(session){
        next()
    }
    else if(!session){
        res.redirect('/')
    }

}