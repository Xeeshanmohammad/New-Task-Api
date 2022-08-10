const express = require('express')
const app = express()
require('dotenv').config()


//connect Database
const connectDb = require('./Database/connect')

//controller
const userRouter = require('./Controllers/user')
const taskRouter = require('./Controllers/task')


//Middleware
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT
const serverStart = async()=>{
    
    await connectDb(process.env.MONGO_URI)
    await app.listen(port,()=>{
        console.log(`Server is listening on port:${port}`);
    })
} 
serverStart()