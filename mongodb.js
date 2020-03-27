const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

const {MongoClient, ObjectID} = mongodb


const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
// const id = new ObjectID()
// console.log(id.id)


MongoClient.connect(connectionUrl, {useNewUrlParser : true,  useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('Unable to connect to mongod wth error = ' + error)
    }

    console.log('Connected to mongodb!');
    // single document insert

    const db = client.db(databaseName)
    db.collection('users').insertOne({
        name: 'Abdul Samea',
        age: 23
    }, (error, result) => {
        if(error){
            return console.log('Unable to insert user!')
        }
        console.log('Inserted user data with record = ' , result.ops)
    })
    //multiple document insert

//     const db = client.db(databaseName)
//     //start inserting user documents
//     db.collection('users').insertMany([{
//         name: 'Abdul Samea',
//         age: 23
//     },
//     {
//         name: 'sam',
//         age: 23
//     }

// ], (error, result) => {
//         if(error){
//             return console.log('Unable to insert users!')
//         }
//         console.log('Inserted user data with records = ' , result.ops)
//     })

//     //start inserting tasks documents.
    
    
// db.collection('tasks').insertMany([{
//     description: 'marriage',
//     completed: false
// },
// {
//     description: 'friendship',
//     completed: true
// },
// {
//     description: 'sports',
//     completed: true
// }
// ], (error, result) => {
//     if(error){
//         return console.log('Unable to insert tasks!')
//     }
//     console.log('Inserted task data with records = ' , result.ops)
// })

//read document 

db.collection('users').findOne({_id:new ObjectID("5e6aef761a9bf60410f08a98")}, (error, user)=>{

    if(error){
        return console.log('Unable to fetch with error = ', error)
    }

    console.log(user)
})

db.collection('users').find({age:23}).toArray((error, users) => {
    if(error){
        return console.log('Unable to fetch with error = ', error)
    }

    console.log(users)
})
  
//find / query data

// db.collection('users').find({age:23}).count((error, usersCount) => {
//     if(error){
//         return console.log('Unable to fetch with error = ', error)
//     }

//     console.log(usersCount)
// })

// db.collection('users').find({age:23}).count().then((res) => {
//     console.log(res)
// }).catch((error) => {
//     console.log('Unable to fetch with error = ', error)
// })

//update data

// const updatePromise = db.collection('tasks').updateMany({
//     completed: false
// },
// {
//     $set:{
//         completed:true
//     }
// })

// updatePromise.then((res)=>{
//     console.log(res)
// }).catch((err)=>{
//     console.log(err)
// })

//delete data

db.collection('users').deleteMany({
    age:18
}).then((res)=> {
    console.log(res)
}).catch((err) => {
    console.log(err)
})

})
