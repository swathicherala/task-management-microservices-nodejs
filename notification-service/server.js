const amqp = require('amqplib')

async function start(){
        try {
            connection = await amqp.connect("amqp://rabbitmq")
            channel = await connection.createChannel()
            await channel.assertQueue("task_created")
            console.log("Notification Service is Listening to messages")
            channel.consume("task_created", (msg) => {
                const taskData = JSON.parse(msg.content.toString())
                console.log('Notification: NEW TASK: ', taskData.title)
                console.log('Notification: NEW TASK: ', taskData)
                channel.ack(msg)
            })
            
        } catch (error) {
            console.error("RabbitMq Connection Error:", error.message)
        }
}


start()