const mongoose = require('mongoose')
const coonection = ()=>{
    return mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('Database Connected'))
    .catch((error)=>{
        console.log('Something went wrong' + error);
    })
}

module.exports = coonection