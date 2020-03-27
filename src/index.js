const express = require('express')
//  if(process.env.ENV == 'DEV'){
    // require('dotenv').config()
//  }


//insure mongoose coonnects to the db using this require statement
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

//register express middleware, include this code before all app.use(%Router) 

// app.use((req, res, next) => {
    
//     res.status(503).send('All services are temporarily unavailable!')
    
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Tasks app is online on port ', port)
})



// example for relationship 

// const User = require('./models/user')
// const Task = require('./models/task')

// const main = async () => {
    //get data for users tasks
//     const user = await User.findById('5e77156fb375e92a48c9baff')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
    //get data for tasks owner
//     // const task =  await Task.findById('5e771efec97a8f2f70d8cb8f')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
// }
// main()
