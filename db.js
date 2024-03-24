const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://sagar:sagar@sagar.mxtoycf.mongodb.net/Transaction?retryWrites=true&w=majority&appName=sagar')
const connection=mongoose.connection
connection.on('connected',()=>{
    console.log('Databse connected successfully')
})
connection.on('error',()=>{
    console.log('Database connection failed')
})

module.exports=mongoose