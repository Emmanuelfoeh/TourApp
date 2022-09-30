const dotenv = require('dotenv')
const mongoose = require('mongoose');
dotenv.config({path:'./config.env'})
const port = process.env.PORT;

app = require('./app')

// const DB = process.env.DATABASE_URL.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(process.env.DATABASE_LOCAL,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false
}).then(()=>console.log("DB connection successful"))




// testTour.save().then(doc=>{
//   console.log(doc)
// }).catch(err=>{
//   console.log("the error :", err)
// })



app.listen(port, () => {
  console.log(`Express server listening on ${port}`);
});
