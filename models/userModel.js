const mongoose=require("mongoose");

const userSchema=new mongoose.Schema(
    {
        fullname:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true

        },
        email:{
            type:String,
            required:true
        },

        number:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true,
        },
        gender:{
            type:String,
            enum:['male','female','prefer not to say'],
            required:false
        },
        is_admin:{
            type:Number,
            required:true
        },
        is_verified:{
            type:Number,
            default:0
        }  
    }
);

//creating model

module.exports=mongoose.model('User', userSchema)