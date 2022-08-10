const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:true
},
email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate:{
        validator:validator.isEmail,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
},

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    validate(value){
        if(value.toLowerCase().includes('password')){
            throw new Error ('password must contain "password')
        }
    }
  },

age:{
    type:Number,
    required:true,
    default:0,
    validate(value){
        if(value<0){
            throw new Error('Age should be greater than 0')
        }
    }
},
tokens:[{
  token:{
    type:String,
    required:true,
  }

}]

})


userSchema.virtual('tasks',{
  ref:'Task',
  localField:"_id",
  foreignField:"owner"

})


userSchema.methods.toJSON  = function(){
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject;
}

userSchema.methods.generateTokenAuth = async function(){
const user = this
const token = jwt.sign({_id:user._id.toString()}, 'thisismyanothernodeproject')
user.tokens = user.tokens.concat({token})
await user.save()

return token
}
 
userSchema.statics.findByCredentials = async function (email, password){
  const user = await User.findOne({email})
  if(!user){
    throw new Error('Invalid Credentials')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    throw new Error('Unable to login')
  }
  return user
}

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
  })
  
  userSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch = await bcrypt.compare(canditatePassword,this.password)
    return isMatch
  }

  userSchema.pre('remove', async function(next){
    const user = this;
    await Task.deleteMany({owner:user._id})
    next()
  })

const User = mongoose.model('User', userSchema)
module.exports = User