const User=require('../models/profileModel');

const professionalDetails=async(req,res)=>{
    try{
        res.render('professionalDetail');
    }catch(error){
        console.log(error.message);
    }
}

module.exports={
    professionalDetails 
}