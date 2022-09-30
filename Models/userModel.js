const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: [true, 'A user name must be provided'],
        trim: true
    },
    email: {type: 'string', required:[true, 'A user email must be provided'], lowercase: true,unique: true},
    password: {type: 'string', required:[true, 'A user password']},
    confirmPassword: {type: 'string', required:[true, 'A user confirmPassword'],
    validate: function(el){
        return el === this.password
    },
    message:'The passwords does not match' 
},
    photos: {type: 'string'},

})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12)

    this.confirmPassword = undefined
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User