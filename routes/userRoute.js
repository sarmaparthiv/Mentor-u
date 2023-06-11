const express=require("express");
const user_route=express();
//using sessions
const session=require("express-session");
 
const config=require("../config/config");

user_route.use(session({secret:config.sessionSecret}));
//using the middleware file auth.js
const auth=require("../middleware/auth")

user_route.set('view engine','pug');
user_route.set('views','./views/users');

const userController=require("../controllers/userController");

user_route.get('/signup',auth.isLogout,userController.loadSignup);

user_route.post('/signup',userController.insertUser);

user_route.get('/',auth.isLogout,userController.loadLanding);
user_route.get('/login',auth.isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);
user_route.get('/home',auth.isLogin,userController.loadHome);

user_route.get('/logout',auth.isLogin,userController.userLogout);

//setting route for edit
user_route.get('/edit',auth.isLogin,userController.editUser);
user_route.get('/jobrequest', auth.isLogin, userController.jobRequest)
user_route.post('/jobrequest', userController.sendJobRequest)
// user_route.post('/edit',userController.updateProfile);
user_route.get('/notifications', auth.isLogin, userController.loadNotifications)
user_route.get('/view-link', auth.isLogin, userController.viewLink)
user_route.post('/finish-session', userController.finishSession)

user_route.post('/payment', userController.makePayment)
user_route.get('/payment-status', auth.isLogin, userController.paymentStatus)
user_route.post('/validate-checkout-session', userController.validateSession)

module.exports=user_route;

