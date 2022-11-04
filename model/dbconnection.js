const mongoose=require('mongoose')
var express = require('express')


const conncetDb= async (DATABASE_URL)=>{
    try{
        const  DB_OPTIONS={dbName:'bigmart'}
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
        console.log("Database connected");
    }catch(error){
        console.log(error);
    }
}

module.exports=conncetDb;