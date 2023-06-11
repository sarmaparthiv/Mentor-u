const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema(
    {
        id: {
            type:String,
            required:true
        },
        clientMail: {
            type:String,
            required:true
        },
        mentorMail: {
            type: String,
            required: true
        }
    }
);

//creating model

module.exports=mongoose.model('transaction', profileSchema)