var amqp = require('amqplib');
const dotenv = require('dotenv');
dotenv.config();

const conString = 'amqp://admin:admin@mq'

async function tryListeningForMessage() {
    try {
        const rabbitConnection = await amqp.connect(conString);

        const channel = await rabbitConnection.createChannel();

        const queue = 'sample';

        await channel.assertQueue(queue,{
            durable: false
        });

        console.log("Listening for message ...");

        channel.consume(queue, (message) => {
            console.log(`Received message: ${message.content.toString()}`)
        },
        {
            noAck: true
        });

    }
    catch (err)
    {
        throw err;
    }
}

tryListeningForMessage();