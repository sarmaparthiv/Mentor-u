const { ObjectId } = require('mongodb');
const Mentor=require('../models/mentorModel');
const User=require('../models/userModel');
const MentorProfile = require('../models/profileModel')

const professionalDetails=async(req,res)=>{
    try{
        res.render('professionalDetail', {router: "/mentor/save"});
    }catch(error){
        console.log(error.message);
    }
}

const saveDetails=async(req,res)=>{
    try{
        const mentorProfile = new MentorProfile(
          {
              email:req.body.email,
              description:req.body.description,
              skills:req.body.skills,
              languages:req.body.languages
          });

        const mentorProfileData=await mentorProfile.save();

        if(mentorProfileData){
            // sendVerifyMail(req.body.name,req.body.email,userData._id);
            const mentorData=await Mentor.findOne({email:mentorProfileData.email});
            const hasNotification = true
            res.render('profile',{user:mentorData, hasNotification:hasNotification});
          }
          else{
            res.redirect('/signup',{message:"oops,signup failed !"});
          }
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
        res.render('signup', {router:"/mentor/submit"});        
        
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
            res.render('professionalDetail', {mentor:mentor, router:"/mentor/save"});
          }
          else{
            res.redirect('/signup',{message:"oops,signup failed !"});
          }
        
    } catch (error) {
        console.log(error.message);
        
    }
}

//login user method started

const loginLoad=async(req,res)=>{
    try {
        res.render('login', {router: "/mentor/login"});
    } catch (error) {
        console.log(error.message);
    }
}

//verify login

const verifyLogin=async(req,res)=>{
    try {
        const email=req.body.email;
        const password=req.body.password;

        const mentorData=await Mentor.findOne({email:email});

        if (mentorData) {

            const passwordMatch=await bcrypt.compare(password,mentorData.password);
            if (passwordMatch) {
                if(mentorData.is_verified===0){
                    res.render('login',{message:"please verify your mail"});
                }else{
                    req.session.user_id=mentorData._id;
                    res.redirect('/mentor/home');
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
        const mentorData=await Mentor.findById({ _id:req.session.user_id });
        const hasNotification = true
        
        if (mentorData){
            res.render('profile',{user:mentorData, hasNotification:hasNotification, router: "/mentor"});

        } else{
            res.redirect("/login")
        }

        
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

const loadNotifications = async (req, res) => {
    try {
        // const userData=User.findByIdAndUpdate({ _id:req.body.user_id },{ $set:{fullname:req.body.fullname, username:req.body.username, email:req.body.email, number:req.body.number} });
        const mentorData=await Mentor.findById({ _id:req.session.user_id });
        console.log("let me see", mentorData.notifications)
        res.render('notifications', {notifications:mentorData.notifications});     
    } catch (error) {
        
    }
}

const jobProceed = async (req, res) => {
    try {
        // const mentorData=await Mentor.findById({ _id:req.session.user_id });
        res.render('jobProceed');     
    } catch (error) {
        console.log(error)
    }
}

const jobSubmit = async (req, res) => {
    try {
        const link = req.body.link
        const clientEmail = req.body.clientEmail
        const filter = { email: clientEmail};
        const update = {
            $push: {
            notifications: {
                title: "AR Development",
                description: "Required experienced AR developer",
                link: link
            },
            },
        };
        await User.updateOne(filter, update);
        res.redirect('/mentor/home');     
    } catch (error) {
        console.log(error)
    }
}

const jobReject = async (req, res) => {
    try {
        const { clientEmail } = req.body;
        const filter = { 'notifications.clientEmail': clientEmail };
        const update = {
        $pull: {
            notifications: { clientEmail },
        },
        };
        await Mentor.updateOne(filter, update);
        res.redirect('/mentor/home');   
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    professionalDetails,
    saveDetails,
    loadSignup,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editUser,
    jobRequest,
    loadNotifications,
    jobProceed,
    jobSubmit,
    jobReject
}