const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

//send tasks data
router.post('/tasks', auth, async (req, res) =>{
  

    try{
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
   
})

//get tasks data
router.get('/tasks', auth, async (req, res) =>{
    completedStatus = false
    limitTasks = 10
    skipTasks = 0
    sortDate = 1
    //get completed status : default = false
    if(req.query.completed){
        completedStatus = req.query.completed === 'true'
    }
    //get limit status : default = 0
    if(req.query.limit){
        limitTasks = parseInt(req.query.limit)
    }
    //get skip status : default = 0
    if(req.query.skip){
        skipTasks = parseInt(req.query.skip)    
    }
    //get sort for date status : default = 1 -> ascending -> 'asc' , or = -1 -> descending -> 'desc'
    if(req.query.sortdate){
        sortDate = req.query.sortdate == 'asc' ? 1 : -1    
    }
    

    try{
        const task = await Task.find({ owner: req.user._id, completed: completedStatus })
        .skip(skipTasks)
        .limit(limitTasks)
        .sort({ 'createdAt': sortDate })
        res.send(task)
    }
    catch(e){
        //send unavailability of server using status code 500
        res.status(500).send(e)
    }
   
})


//get task data by id
router.get('/tasks/:id', auth, async (req, res) =>{

    const _id =  (req.params.id)

    //check for valid _id pattern, as seen from mongodb.
    // if (_id.match(/^[0-9a-fA-F]{24}$/)) {
        
        try{

            // const task = await Task.findById(_id)
            const task = await Task.findOne({ _id, owner:req.user._id })
            // if no task found
            if(!task) {
            return res.status(404).send(task)
            }

            res.send(task)
        }
        catch(e){
            res.status(400).send({error:'Invalid Id pattern for task.'})
        }

    // }
  
    // else{
    //     res.status(400).send({error:'Invalid Id pattern for task.'})
    // }
    
})



//patch tasks data
router.patch('/tasks/:id', auth, async (req, res) =>{
    //check condition where user passes invalid task db field
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid field updates!'})
    }

    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        // findByIdAndUpdate bypasses mongoose middleware for event capturing, hence use above ocode for updation
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body,  {new: true, runValidators: true})
        if(!task){
            return res.status(404).send()
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//delete tasks data

router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        const task = await Task.findOneAndDelete({  _id: req.params.id, owner: req.user._id })
        if(!task){
            return res.status(404).send()
        }
        task.de
        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
})


module.exports = router