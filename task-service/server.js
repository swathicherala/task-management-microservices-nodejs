const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = 5001
const bodyParser = require('body-parser')
const amqp = require('amqplib')
app.use(bodyParser.json())

mongoose.connect('mongodb://mongo:27017/tasks')
.then(()=>{
    console.log('Mongodb connected successfully')
})
.catch((err)=>{
    console.log(err)
})

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})
const Task = mongoose.model('task',taskSchema)

let channel, connection

async function connectRabbitMQWithRetry(retries=5, delay=3000){
    while(retries){
        try {
            connection = await amqp.connect("amqp://rabbitmq")
            channel = await connection.createChannel()
            await channel.assertQueue("task_created")
            console.log("Connected to Rabbitmq")
            return 
        } catch (error) {
            console.error("RabbitMq Connection Error:", error.message)
            retries--
            console.error("Retrying again:", retries)
            await new Promise(res => setTimeout(res, delay))
        }
    }
}

app.post('/tasks',async(req,res)=>{
    const {title, description, userId} = req.body
    try {
        const task = new Task({title, description, userId})
        await task.save()

        const message = { taskId: task._id, userId, title }

        if(!channel){
            return res.status(503).json({error: "Rabbitmq not connected"})
        }

        channel.sendToQueue("task_created", Buffer.from(
            JSON.stringify(message)
        ))

        return res.status(201).json(task)
    } catch (error) {
        console.error('Error saving', error)
        return res.status(500).json({error:'Internal Server Error'})
    }
})

app.get('/tasks',async(req,res)=>{
    try {
        const task = await Task.find()
        return res.status(200).json(task)
    } catch (error) {
        console.error('Error saving', error)
        return res.status(500).json({error:'Internal Server Error'})
    }
})

app.listen(port,()=>{
    console.log(`Task Service is running on port ${port}`)
    connectRabbitMQWithRetry()
})