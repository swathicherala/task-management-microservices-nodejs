const amqp = require('amqplib')
require('dotenv').config()
const nodemailer = require('nodemailer')

let connection
let channel

async function sendEmail(taskData) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: taskData.email,
            subject: 'Task Created Successfully',
            html: `
                <h2>New Task Created</h2>
                <p><strong>Task Title:</strong> ${taskData.title}</p>
                <p>Your task was created successfully.</p>
            `
        }

        const info = await transporter.sendMail(mailOptions)

        console.log("Email Sent:", info.response)

    } catch (error) {
        console.error("Email Error:", error.message)
    }
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

async function start(){
        try {
            connection = await amqp.connect("amqp://rabbitmq")
            channel = await connection.createChannel()
            await channel.assertQueue("task_created")
            console.log("Notification Service is Listening to messages")
            channel.consume("task_created", async (msg) => {
                const taskData = JSON.parse(msg.content.toString())
                // console.log('Notification: NEW TASK: ', taskData.title)
                // console.log('Notification: NEW TASK: ', taskData)
                console.log("Message Received:", taskData)

                await sendEmail(taskData)
                channel.ack(msg)
            })
            
        } catch (error) {
            console.error("RabbitMq Connection Error:", error.message)
        }
}


start()