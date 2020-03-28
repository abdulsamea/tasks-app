const mongoose = require('mongoose')

const taskSchema  = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,
       
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //link to User ref model
        ref: 'User'
    }


},{
    timestamps: true
})

//create user middleware / hook

taskSchema.pre('save', async function(next) {

    const task = this
   console.log('task saved with id = ', task['_id'])

   next()
})

//create new tasks model
const Task = mongoose.model('Tasks', taskSchema)
module.exports = Task