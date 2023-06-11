const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema(
    {
        email: {
            type:String,
            required:true
        },
        //added by parthiv
        fullname:{
            type:String,
            required:true
        },
        occupation:{
            type:String,
            required:true
        },
        skills:{
            type:String,
            required:true

        },
        languages:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        //added by parthiv
        cost:{
            type:Number,
            required:true
        }
    }
);

//creating model

module.exports=mongoose.model('MentorProfile', profileSchema)