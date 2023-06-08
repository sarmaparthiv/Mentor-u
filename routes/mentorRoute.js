const express=require("express");
const mentor_route=express();
//using sessions
const session=require("express-session");
 
const config=require("../config/config");

mentor_route.use(session({secret:config.sessionSecret}));
//using the middleware file auth.js
const auth=require("../middleware/auth")

mentor_route.set('view engine','pug');
mentor_route.set('views','./views/users');

 
const mentorController=require("../controllers/mentorController");

mentor_route.get('/signup',auth.isLogout,mentorController.loadSignup);

mentor_route.post('/submit',mentorController.insertUser);

mentor_route.get('/details', auth.isLogout, mentorController.professionalDetails)
mentor_route.post('/save', mentorController.saveDetails)

mentor_route.get('/',auth.isLogout,mentorController.loginLoad);
mentor_route.get('/login',auth.isLogout,mentorController.loginLoad);

mentor_route.post('/login',mentorController.verifyLogin);
mentor_route.get('/home',auth.isLogin,mentorController.loadHome);

mentor_route.get('/logout',auth.isLogin,mentorController.userLogout);

//setting route for edit
mentor_route.get('/edit',auth.isLogin,mentorController.editUser);
mentor_route.get('/jobrequest', auth.isLogin, mentorController.jobRequest)
// user_route.post('/edit',userController.updateProfile);
mentor_route.get('/notifications', auth.isLogin, mentorController.loadNotifications)

module.exports=mentor_route;

