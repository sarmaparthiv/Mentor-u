const express=require("express");
const user_route=express();

user_route.set('view engine','pug');
user_route.set('views','./views/users');


 
const userController=require("../controllers/userController");

user_route.get('/signup',userController.loadSignup);

user_route.post('/signup',userController.insertUser);

module.exports=user_route;

