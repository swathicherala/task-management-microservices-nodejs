const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 5000
const bodyParser = require('body-parser')
app.use(bodyParser.json())

mongoose.connect('mongodb://mongo:27017/users')
.then(()=>{
    console.log('Mongodb connected successfully')
})
.catch((err)=>{
    console.log(err)
})

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    }
})
const User = mongoose.model('user',userSchema)

app.post('/users',async(req,res)=>{
    const {name, email} = req.body
    try {
        const user = new User({name, email})
        await user.save()
        return res.status(201).json(user)
    } catch (error) {
        console.error('Error saving', error)
        return res.status(500).json({error:'Internal Server Error'})
    }
})

app.get('/users',async(req,res)=>{
    try {
        const user = await User.find()
        return res.status(200).json(user)
    } catch (error) {
        console.error('Error saving', error)
        return res.status(500).json({error:'Internal Server Error'})
    }
})

app.listen(port,()=>{
    console.log(`User service is running on port ${port}`)
})