const express=require("express");
const mentor_route = express();

mentor_route.set('view engine','pug');
mentor_route.set('views','./views/users');

const mentorController=require("../controllers/mentorController");

mentor_route.get('/profiledetails', mentorController.professionalDetails);

module.exports=mentor_route;

