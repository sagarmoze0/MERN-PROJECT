const express=require('express')
const cors=require('cors')
const db=require('./db')
const app=express()

app.use(cors({
    origin: 'http://localhost:3001'
  }))
  
app.use(express.json())
const apiRoute=require('./src/routes/apiRoute')

app.use('/api/apitems',apiRoute)
app.listen(3000,()=>console.log('Server is running on port 3000'))