const mongoose=require("mongoose");

const mentorSchema=new mongoose.Schema(
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
            default:1
        },
        notifications: {
            type: [{
              title: {
                type: String,
                required: true,
              },
              description: {
                type: String,
                required: true,
              },
            }],
            default: [],
          },
    }
);

//creating model

module.exports=mongoose.model('Mentor', mentorSchema)