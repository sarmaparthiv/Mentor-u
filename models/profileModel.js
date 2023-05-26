const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema(
    {
        description:{
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
        }  
    }
);

//creating model

module.exports=mongoose.model('MentorProfile', profileSchema)