const { ObjectId } = require('mongodb');
const User=require('../models/userModel');
const Mentor = require('../models/mentorModel')
const MentorProfile = require('../models/profileModel')
//using bcrypt
const bcrypt=require('bcrypt');
require('dotenv').config()
const SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripe = require('stripe')(SECRET_KEY)
//nodemailer
// const nodemailer=require("nodemailer");

var transaction = ''
var transaction_clientMail = ''
var transaction_mentorMail = ''
var transaction_occupation = ''

const securePassword=async(password)=>{
    try {
       const passwordHash= await bcrypt.hash(password,10);
       return passwordHash;
        
    } catch (error) {
        console.log(error.message);
    }
}

const loadLanding = async(req, res) => {
    try{
        res.render('landing')
    }catch(error){
        console.log(error)
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
            res.redirect('/login');
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

const loginOptions=async(req, res) => {
    try{
        res.render('loginOption')
    }catch(error) {
        console.log(error)
    }
}

const signupOptions=async(req, res) => {
    try{
        res.render('signupOption')
    }catch(error) {
        console.log(error)
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

        const userData = await User.findById({_id:req.session.user_id})
        var hasNotification = true
        if (userData.notifications.length == 0){
            hasNotification = false
        }
        const router = ""
        const user =await User.findById({_id:req.session.user_id})
        res.render('home',{services:mentorProfileData, hasNotification:hasNotification, user:user, router});
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

const contact=async(req,res)=>{
    try {
        res.render('contact')
    } catch (error) {
        console.log(error.message);
    }

}

const jobRequest = async(req, res)=>{
    try{
        const userData=await User.findById({ _id:req.session.user_id });
        const profileData = await MentorProfile.findOne({email:req.query.email})
        const mentorData = await Mentor.findOne({email:req.query.email})
        if(userData){
            res.render('jobRequest',{user:userData, profileData:profileData, mentorData:mentorData});
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
        userData = await User.findById({_id:req.session.user_id})
        res.render('notificationsUser', {notifications:userData.notifications});     
    } catch (error) {
        
    }
}


const sendJobRequest = async (req, res) => {
    try {
      const user = await User.findById({ _id:req.session.user_id })
      const clientEmail = user.email

      const filter = { email: req.body.email };
      const update = {
        $push: {
          notifications: {
            title: req.body.occupation,
            description: "Required experienced " + req.body.occupation,
            clientEmail: clientEmail
          },
        },
      };
      await Mentor.updateOne(filter, update);
      res.redirect('/home')
    } catch (error) {
      console.log(error);
    }
  };

  const viewLink = async (req, res) => {
    try {
        console.log("link ", req.query.link)
        const link = req.query.link
        req.session.allow = true
        res.redirect(link)    
    } catch (error) {
        console.log(error)
    }
}

const finishSession = async(req, res) => {
    try{
        const { link } = req.body;
        const filter = { 'notifications.link': link };
        const update = {
        $pull: {
            notifications: { link },
            },
        };
        await User.updateOne(filter, update);
        res.redirect("/notifications");
    } catch{
        console.log(error)
    }
}

// payment

const createNewCustomer = async(clientEmail) => {
    try{
        
        const customer = await stripe.customers.create({
            email: clientEmail
        })
        return(customer.id)
    }
    catch (error) {
        console.log(error)
    }
}

const createPriceForProduct = async (jobName, cost) => {

    try {
        const product = await stripe.products.create({
            name: jobName + ' Session',
          });

        const price = await stripe.prices.create({
            unit_amount: cost*100,
            currency: 'inr',
            product: product.id,
          });

        return price

    } catch (error){
        console.log(error)
    }
}

const createSession = async (user, mentorProfile) => {    
    try {
        const price = await createPriceForProduct(mentorProfile.occupation, mentorProfile.cost)
        const customer_id = await createNewCustomer(user.email)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer: customer_id,
            success_url: 'http://127.0.0.1:3000/payment-status',
            cancel_url: 'http://127.0.0.1:3000/home',
            line_items: [
                {price: price.id , quantity: 1},
              ]
          })
        return session
    } catch (error) {
        console.log(error)
    }   
}

const validateSession = async (checkout_session_id) => {
    try {
        
        const session = await stripe.checkout.sessions.retrieve(
            checkout_session_id
          );

        return(session.payment_status);

    } catch (error) {
        console.log(error)
    }
}

const makePayment = async(req, res) => {
    try{
        const user = await User.findById({_id: req.session.user_id})
        const profileData = await MentorProfile.findOne({email:req.body.email})
        const checkoutSession = await createSession(user, profileData)
        transaction = checkoutSession.id
        transaction_clientMail = user.email
        transaction_mentorMail = profileData.email
        transaction_occupation = profileData.occupation
        req.session.allow = true
        res.redirect(checkoutSession.url)
    } catch (error) {
        console.log(error)
    }
    
}

const paymentStatus = async(req, res) => {
    try{
        const transaction_validate = await validateSession(transaction)
        if (transaction_validate == 'paid') {
            const clientEmail = transaction_clientMail
            const clientData = await User.findById({_id:req.session.user_id})
            const filter = { email:transaction_mentorMail };
            const update = {
                $push: {
                notifications: {
                    title: clientData.fullname,
                    description: "Required experienced " + transaction_occupation,
                    clientEmail: clientEmail
                },
                },
            };
            await Mentor.updateOne(filter, update);
        }
        res.render('paymentStatus', {status:transaction_validate})
    } catch(error) {
        console.log(error)
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
    loadNotifications,
    sendJobRequest,
    viewLink,
    createSession,
    makePayment,
    validateSession,
    paymentStatus,
    finishSession,
    loadLanding,
    loginOptions,
    signupOptions,
    contact
}