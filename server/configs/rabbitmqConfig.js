require('dotenv').config();

module.exports = {
    conString: process.env.RABBITMQ,
    queueName: process.env.RABBITMQ_QUEUE_NAME
}
