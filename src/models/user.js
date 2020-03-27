const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
 

//create user schema
const userSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 1,
        validate(value) {
            if (value < 1) {
                throw new Error('Age must be greater than 1')
            }
        }
    },

    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email format is invalid')
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength:6,
        validate(value) {

            if (value.toLowerCase().includes('password')) {
                throw new Error('Password should not contain "password"!!')
            }
        }
},
//stores auth token
tokens:[{
    token: {
        type: String,
        required: true
    }
}],
    avatar:{
        type: Buffer
    },
}
,{
    timestamps: true
})



//user auth token generation

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'jMU^RD$%cyKOyc',{expiresIn: '7 days'})
   
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//user login validation function
userSchema.statics.findyByCredentials = async(email, password) => {
    const user = await User.findOne({ email : email })
      if(!user){
        throw new Error('Unable to Login!')
    }
    //compares raw password with user stored hashed password
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to Login!')
    }
    
    return user
}


//set virtual field hich links tasks to its user
//virtual field doesn't get stored in db, only for viewing purpose
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})


//send back user data on login, toJSON captures default method whenever json is send in response
userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

//create user middleware / hook for hashing password

userSchema.pre('save', async function(next) {

    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

//create hook foe deleting all tasks when user deletes his/her profile

userSchema.pre('remove', async function(next) {

    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})



//create new users model
const User = mongoose.model('User', userSchema)

module.exports = User