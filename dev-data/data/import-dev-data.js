const fs = require('fs')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const Tour = require("../../Models/tourModel")

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8')) 

console.log(tours)

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const importData = async()=>{
    try {
        await Tour.create(tours)
        console.log('data successfully loaded')
        process.exit()
    } catch (error) {
        console.log(error)
        
    }
}

const deleteData = async () =>{
    try {
        await Tour.deleteMany()
        console.log("all data deleted from db")
        process.exit()
    } catch (error) {
        console.log(error)
        
    }
}

if(process.argv[2] ==='--import'){
    importData()
}else if(process.argv[2] === '--delete'){
    deleteData()
}