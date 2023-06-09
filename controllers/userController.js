const { ObjectId } = require('mongodb');
const User=require('../models/userModel');
const MentorProfile = require('../models/profileModel');
//using bcrypt
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
       
            res.render('signup', {router:"/signup"});        
        
    }catch(error){

        console.log(error.message);

    }

}
 
const insertUser=async(req,res)=>{
    try {
        // console.log(req.body);
          const spassword=await securePassword(req.body.password);
          const user=new User(
            {
                fullname:req.body.fullname,
                username:req.body.username,
                email:req.body.email,
                number:req.body.number,
                // password:req.body.password,
                 password:spassword,
                // gender:req.body.gender,
                is_admin:0
            });

          const userData=await user.save();
           
          if(userData){

            // sendVerifyMail(req.body.name,req.body.email,userData._id);
            res.render('signup',{message:"Sign up has been sucessful"});
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
        res.render('login', {router: "/login"});
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
        const query = MentorProfile.find({});
        const documents = await query.exec();
        const documentList = documents.map(doc => doc.toObject());
        const mentorProfileData=documentList
        const hasNotification = true
        res.render('home',{services:mentorProfileData, hasNotification:hasNotification});
        // res.render('profile');

        
    } catch (error) {
        console.log(error.message);
        return [];
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

const jobRequest = async(req, res)=>{
    try{
        const id = new ObjectId(req.query.id)
        const userData=await User.findById({ _id:id })
        if(userData){
            res.render('jobRequest',{user:userData});
        }
        else{
            res.redirect('/home');
        }
    }
    catch(error){
        console.log(error.message)
    }
}

const updateProfile=async(req,res)=>{
    try {
        const userData=User.findByIdAndUpdate({ _id:req.body.user_id },{ $set:{fullname:req.body.fullname, username:req.body.username, email:req.body.email, number:req.body.number} });
        res.redirect('/home');     
    } catch (error) {
        
    }
}

const loadNotifications = async (req, res) => {
    try {
        // const userData=User.findByIdAndUpdate({ _id:req.body.user_id },{ $set:{fullname:req.body.fullname, username:req.body.username, email:req.body.email, number:req.body.number} });
        const dummyNotifications = [{title:"AI mentor 1 hour session", description:"Need an AI mentor for my college project"}]
        res.render('notifications', {notifications:dummyNotifications});     
    } catch (error) {
        
    }
}

module.exports={
    loadSignup,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editUser,
    jobRequest,
    loadNotifications
}