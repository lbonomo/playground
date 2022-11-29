import AWS from 'aws-sdk';
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import { getSystemErrorMap } from 'util';

// Environment vars
dotenv.config()
const queue_url: string = (process.env.QUEUE_URL) ? (process.env.QUEUE_URL) : ''
const aws_key: string = (process.env.AWS_KEY) ? (process.env.AWS_KEY) : ''
const aws_secret: string = (process.env.AWS_SECRET) ? (process.env.AWS_SECRET) : ''
const aws_region: string = (process.env.AWS_REGION) ? (process.env.AWS_REGION) : 'us-east-1'

// AWS.
const credentials = {
    accessKeyId: aws_key,
    secretAccessKey: aws_secret,
};


AWS.config.credentials = credentials
AWS.config.update({ region: aws_region });
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const params = {
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queue_url,
};

sqs.receiveMessage(params, async function (err: any, data: any) {
    if (err) {
        console.log("Receive Error", err);
    } else if (data.Messages) {
        let body = {}
        let md5OfBody
        try {
            body = JSON.parse(data.Messages[0].Body)
            md5OfBody = data.Messages[0].MD5OfBody
            let hash = crypto.createHash('md5').update(data.Messages[0].Body).digest("hex")
            if (hash !== md5OfBody) {
                console.log("Maybe network issue")
                process.exit(1);
            }
        } catch {
            body = data.Messages[0].Body
        }
        let deleteParams = {
            QueueUrl: queue_url,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };


        let result = await doSomething(body)

        // Delete message
        if (result.status) {
            console.log(`Deleting message: ${data.Messages[0].MessageId}`)
            sqs.deleteMessage(deleteParams, function (err: any, data: any) {
                if (err) {
                    console.log(`Delete Error ${err} \n "Message: ${data}`);
                }
            });
        } else {
            console.log(result.message)
        }
    }
});

const sleep = async (seconds: number) => {
    await new Promise(resolve => {
        return setTimeout(resolve, seconds * 1000)
    });
};

async function doSomething(body: {}) {
    // await sleep(5)
    console.log(body)
    return {
        status: true,
        message: null
    }
}