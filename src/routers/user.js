const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const User = require('../models/user')
const { sendWelcomeMail, sendCancellationMail } = require('../email/account')

const router = new express.Router()
//send user data, register
router.post('/users', async (req, res) =>{
  
    try{
        const user = new User(req.body)
        sendWelcomeMail(user.email, user.name)
        const token =  await user.generateAuthToken()
        //generate auth token also saves the user so comment below line for saving user
        // await user.save()
        // send token in response to access in postman script for authtoken variable updation 
        res.status(201).send({user, token})
    }
    catch(e){
        //send bad request http error
        res.status(400).send(e)
    }

})


//login router
router.post('/users/login', async (req, res) => {
    try{
        
        const user = await User.findyByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // send token in response to access in postman script for authtoken variable updation 
        res.send({user, token})
    }
    catch(e){
        res.status(400).send()
    }
})

//logout router 
//device specific 
//token for user (device specific) is returned from auth
router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})

//logout router
//all devices 
router.post('/users/logoutall', auth, async(req, res) => {
    try{
        //clear entire tokens array
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})


//get user data, but prior to that use auth mechanism 
router.get('/users/me', auth , async (req, res) =>{
    res.send(req.user)
})

//patch users data
router.patch('/users/me', auth,  async (req, res) =>{
    //check condition where user passes invalid user db field
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid field updates!'})
    }

    try{

      

        updates.forEach((update) => {
           req.user[update] = req.body[update]
        })
        await req.user.save()
        // findByIdAndUpdate bypasses mongoose middleware for event capturing, hence use above ocode for updation
        // const user = await User.findById AndUpdate(req.params.id, req.body,  {new: true, runValidators: true})
    
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//delete users data
router.delete('/users/me', auth, async(req, res) => {
    try{
        await req.user.remove()
        sendCancellationMail(req.user.email, req.user.name)
        res.send(req.user)
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

//provide dest. folder for avatar
const upload = multer({
    // use dest field to save file binary in a location
    // dest: 'avatars',
    limits: {
        fileSize: 1000000 // 1mb
    },
    //only images
    fileFilter(req, file, callback){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            return callback(new Error('Please upload an image!'))
        }
        callback(undefined, true)
    }
})

//add user avatar
//upload.single('avatar') represends param named 'avatar' to be used on file upload in api / postman
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    //reduce file size and convert to png
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
    //callback for json response ti be send on error handling 
}, (error, req, res, next) =>{
    res.status(400).send({error: error.message})
})

//delete user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send() 
 })


//get user avatar
router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
 })





module.exports = router