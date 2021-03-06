const mongoose = require('mongoose')

// env == 'PROD' or 'DEV' or 'TEST'
let conn
if(process.env.ENV == 'PROD'){
    conn = process.env.MONGO_DB_PROD_URL
}

if(process.env.ENV == 'DEV'){
    conn = process.env.MONGO_DB_DEV_URL
}

if(process.env.ENV == 'TEST'){
    conn = process.env.MONGO_DB_TEST_URL
}

mongoose.connect(conn, {
    useNewUrlParser : true,  
    useUnifiedTopology: true
})
mongoose.set('useCreateIndex', true);

