const User=require('../models/userModel');

const loadSignup=async(req,res)=>{
    try{

        res.render('signup');

    }catch(error){

        console.log(error.message);

    }

}

const insertUser=async(req,res)=>{
    try {
        console.log(req.body);
          const user=new User(
            {
                fullname:req.body.fullname,
                username:req.body.username,
                email:req.body.email,
                number:req.body.number,
                password:req.body.password,
                // gender:req.body.gender,
                is_admin:0
            });

          const userData=await user.save();
           
          if(userData){
            res.render('signup',{message:"Sign up has been sucessful"});
          }
          else{
            res.render('signup',{message:"oops,signup failed !"});
          }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

module.exports={
    loadSignup,
    insertUser 
}