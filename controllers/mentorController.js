const { ObjectId } = require('mongodb');
const Mentor=require('../models/mentorModel');

const professionalDetails=async(req,res)=>{
    try{
        res.render('professionalDetail');
    }catch(error){
        console.log(error.message);
    }
}

const bcrypt=require('bcrypt');

//nodemailer
// const nodemailer=require("nodemailer");

const securePassword=async(password)=>{
    try {
       const passwordHash= await bcrypt.hash(password,10);
       return passwordHash;
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadSignup=async(req,res)=>{
    try{
        res.render('signup');        
        
    }catch(error){

        console.log(error.message);

    }

}
 
const insertUser=async(req,res)=>{
    try {
        // console.log(req.body);
          const spassword=await securePassword(req.body.password);
          const mentor = new Mentor(
            {
                fullname:req.body.fullname,
                username:req.body.username,
                email:req.body.email,
                number:req.body.number,
                password:spassword,
                // gender:req.body.gender,
                is_admin:0
            });

          const mentorData=await mentor.save();
           
          if(mentorData){

            // sendVerifyMail(req.body.name,req.body.email,userData._id);
            res.render('profile',{message:"Sign up has been sucessful"});
          }
          else{
            res.render('signup',{message:"oops,signup failed !"});
          }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

//login user method started

const loginLoad=async(req,res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

//verify login

const verifyLogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email:email});

        if (userData) {

            const passwordMatch=await bcrypt.compare(password,userData.password);
            if (passwordMatch) {
                if(userData.is_verified===0){
                    res.render('login',{message:"please verify your mail"});
                }else{
                    req.session.user_id=userData._id;
                    res.redirect('/home');
                }
                
            } else {
                res.render('login',{message:"Email/password are incorrect!"});
            
            }
            
        } else {
            res.render('login',{message:"Email/password are incorrect!"})
            
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//load home
const loadHome=async(req,res)=>{
    try {

        // const user = await user.getUser();
        // req.user = user;
        const mentorData=await User.findById({ _id:req.session.user_id });
        const hasNotification = true
        res.render('profile',{user:userData, hasNotification:hasNotification});
        // res.render('profile');

        
    } catch (error) {
        console.log(error.message);
    }

}

//user logout
const userLogout=async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
        
    } catch (error) {
        console.log(error.message);
    }

}

//user profile edit and update
const editUser=async(req,res)=>{
    try {
        // const id='5f4ebe073c6a0d23745063d0';
        const id = new ObjectId(req.query.id)
        const userData=await User.findById({ _id:id });
        console.log("user data")
        console.log(userData)
        if(userData){
            res.render('edit',{user:userData});
        }
        else{
            res.redirect('/home');
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadNotifications = async (req, res) => {
    try {
        // const userData=User.findByIdAndUpdate({ _id:req.body.user_id },{ $set:{fullname:req.body.fullname, username:req.body.username, email:req.body.email, number:req.body.number} });
        const dummyNotifications = [{title:"AI mentor 1 hour session", message:"Need an AI mentor for my college project"}]
        res.render('notifications', {notifications:dummyNotifications});     
    } catch (error) {
        
    }
}



module.exports={
    professionalDetails,
    loadSignup,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editUser,
    loadNotifications
}