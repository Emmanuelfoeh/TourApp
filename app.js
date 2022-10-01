const express = require('express');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const morgan = require('morgan');
const tourRoute = require('./routes/tourRoutes')
const userRoute = require('./routes/userRoutes')
const app = express();

// 1) Middlewares
if(process.env.NODE_ENV ==='development'){
  app.use(morgan('dev'))  
}
app.use(express.json())

app.use(express.static(`${__dirname}/public`))

// app.use((req,res,next)=>{
//     req.requestTime = new Date().toISOString()

//     // console.log(req.headers)
//     next()
// })






// Routes
app.use("/api/v1/tours",tourRoute)
app.use("/api/v1/users",userRoute)

app.all('*',(req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

app.use(globalErrorHandler)

module.exports = app