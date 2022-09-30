const express = require('express');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const morgan = require('morgan');
const app = express();

app.use(express.json())

app.use(morgan('dev'))

const tourRoute = require('./routes/tourRoutes')
const userRoute = require('./routes/userRoutes')

app.use("/api/v1/tours",tourRoute)
app.use("/api/v1/users",userRoute)

app.all('*',(req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

app.use(globalErrorHandler)

module.exports = app