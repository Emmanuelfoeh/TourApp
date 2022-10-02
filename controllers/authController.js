const crypto = require('crypto')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const { catchAsync } = require('../utils/catchAsync')
const User = require('./../Models/userModel')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')



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
    const token = signToken(user._id)
    res.status(200).json({
        status:'success',
        token
    })
})

exports.protect = catchAsync (async(req,res,next)=>{
    // 1) get token and check if it there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // console.log('token here',token)

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.',401))
    }

    // 2) verify the token
    const decode = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    // console.log('decode',decode)

    // 3) check if user still exist
    const newUser = await User.findById(decode.id)
    if(!newUser){
        return next(new AppError('The user belonging to this token no longer exist',401))
    }

    
    // check if user change password after token was issued
    if (newUser.changedPasswordAfter(decode.iat)) {
       return next(new AppError('There is change in password, Please login again',401))
    }

    req.user  = newUser

    next()
})

exports.restrictTo = (...role)=>{
    return (req,res,next)=>{

        if(!role.includes(req.user.role)){
          return  next(new AppError('you do not have permission to perform this action',403))
        }
       next()  
    }
}

exports.forgetPassword = catchAsync(async(req,res,next)=>{
const user = await User.findOne({email: req.body.email})
if(!user){
    return next(new AppError("There is no user with this email.",404))
}

const resetToken = user.createPasswordResetToken();
await user.save({validateBeforeSave: false})

const resetURL =  `${req.protocol}://${req.get('host')}/api/v1/resetPassword/${resetToken}`

const message = `Forget your Password? send your new password to the send link provided: ${resetURL} `

try {
    await sendEmail({
        email:user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message
    })

    res.status(200).json({
        status:'success',
        message: "token send to email"
    })

} catch (error) {
   user.passwordResetToken = undefined;
   user.passwordResetExpires = undefined;
   await user.save({validateBeforeSave: false}) 

   return next(new AppError(`the error is ${error}`,500))
}

//    next() 
})

exports.resetPassword  = catchAsync(async(req,res,next)=>{
    // get user base on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        passwordResetToken:hashedToken,passwordResetExpires :{$gt:Date.now()}
    })

   if(!user){
    return next(new AppError('Token is invalid or it has expires',400))
   } 

   user.password = req.body.password
   user.confirmPassword = req.body.confirmPassword
   user.passwordResetExpires = undefined
   user.passwordResetToken = undefined
   await user.save()

//    update changePasswordAt property for user
//    Log user in, send jwt

const token = signToken(user._id)

res.status(200).json({
    status:'success',
    token
})

})