var amqp = require('amqplib');
const {
    conString,
    queueName
} = require('../configs/rabbitmqConfig');

async function trySendingMessage (message) {
    
    try {
        const rabbitConnection = await amqp.connect(conString);

        const channel = await rabbitConnection.createChannel();

        const queue = queueName;

        await channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`message sent ${message}`);
        channel.on('return', (msg) => {
            console.error('Message returned:', msg.content.toString());
          });

        await channel.close();
        await rabbitConnection.close();
    }
    catch(err)
    {
        throw err;
    }
}

module.exports = {
    trySendingMessage
}