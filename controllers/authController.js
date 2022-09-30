const jwt = require('jsonwebtoken')
const { catchAsync } = require('../utils/catchAsync')
const User = require('./../Models/userModel')
const AppError = require('./../utils/appError')


const signToken = id=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
}
exports.signup = catchAsync( async (req, res, next) => {
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword
    })

 const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        user:{
            newUser
        }
    }) 
})


exports.login = catchAsync (async (req,res,next)=>{
    const {email,password} = req.body

    // 1) check if email and password exist
    if(!email || !password){
       return next( new AppError('Please provide email and password',400))
    }
    // 2) check if user exist and password is correct
    const user = await User.findOne({email}).select('+password')
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect Email or Password', 401));
    }
    // if everything is ok. send token to client
    const token = signToken(user._d)
    res.status(200).json({
        status:'success',
        token
    })
})