//creating methods isLogin and isLogout
//next is a method that checks your authorization
//if auth is correct we move ahead ,otherwise we don't

const isLogin=async(req,res,next)=>{
    try {

        if(req.session.user_id){}
        else{
            res.redirect('/');
        }
        next();
    } catch (error) {
        console.log(error.message);     
        
    }

}

const isLogout=async(req,res,next)=>{
    try {
        // console.log(req.session.user_id)
        if(req.session.user_id){
            res.redirect('/home');
        }
        // else{
        //     res.redirect('/');
        //     // next();
        // }
        next();
        
    } catch (error) {
        console.log(error.message);
        
    }

}

module.exports={
    isLogin,
    isLogout
}