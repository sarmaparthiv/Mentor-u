const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/mentor-u");


const express=require("express");
const app=express();

//using body-parser
const bodyParser=require('body-parser');
//encoding form data
app.use(bodyParser.json());
//url encoding
app.use(bodyParser.urlencoded({extended:true})) //passing extended true as  a object


//for user routes
// app.use(express.static('/public'));

const userRoute=require('./routes/userRoute')
app.use('/',userRoute);

app.listen(3000,function(){ 
            console.log("Server is running..");
});


