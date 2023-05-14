var amqp = require('amqplib');
const joi = require('joi');
const dotenv = require('dotenv');
const { automatedJudgeSubmission } = require('./services/SubmissionJudge');
dotenv.config();
const logger = require('./utils/logger')

const { conString, queueName } = require('./configs/rabbitmqConfig');

async function sleep(milisec) {
    return await new Promise(r => setTimeout(r, milisec));
}

async function tryListeningForMessage() {
    try {
        logger.info('Consumer starting ...');
        const rabbitConnection = await amqp.connect(conString);

        const channel = await rabbitConnection.createChannel();

        const queue = queueName;

        await channel.assertQueue(queue,{
            durable: false
        });
        logger.success('Consumer started success on host:');
        logger.success(conString.split('@')[1]);
        logger.info(`Listening for message on queue ${queue} ...`);
        

        channel.consume(queue, async (message) => {
            try {
                const content = (JSON.parse(message.content.toString()));

                const submissionId = content.submissionId;
                const type = content.type;

                if(!type || type !== 'JUDGE')
                {
                    channel.nack(message, false, false);
                    return;
                }

                const validatedSubmissionId = joi.string().uuid().validate(submissionId);

                if(validatedSubmissionId.error)
                {
                    logger.error('submission not valid');
                    logger.error(validatedSubmissionId);
                    channel.nack(message, false, false);
                    return;
                }
                
                await automatedJudgeSubmission(submissionId);
                logger.success('Job completed successfully');
                channel.ack(message);
            }
            catch (err)
            {
                logger.error(err);
                channel.ack(message);
            }
        });

        channel.on('error', (err) => {
            logger.error(err);
            channel.close();
        });

        channel.on('close', () => {
            logger.warn('Channel closed, attempting to restart ...');
            tryListeningForMessage();
        })
    }
    catch (err)
    {
        logger.error(err);
        logger.warn('Consumer crashed, restarting ...');
        await sleep(5000);
        tryListeningForMessage();
    }
}

tryListeningForMessage();