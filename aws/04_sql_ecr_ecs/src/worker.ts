import AWS from 'aws-sdk';
import * as dotenv from 'dotenv'

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
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queue_url,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
};

sqs.receiveMessage(params, function (err: any, data: any) {
    if (err) {
        console.log("Receive Error", err);
    } else if (data.Messages) {
        let body = {}
        try {
            body = JSON.parse(data.Messages[0].Body)
        } catch {
            body = data.Messages[0].Body
        }
        let deleteParams = {
            QueueUrl: queue_url,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };

        console.log(body)

        // Delete message
        sqs.deleteMessage(deleteParams, function (err: any, data: any) {
            if (err) {
                console.log(`Delete Error ${err} \n "Message: ${data}`);
            }
        });
    }
});