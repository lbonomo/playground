import AWS from 'aws-sdk';
import * as dotenv from 'dotenv'

// Environment vars
dotenv.config()
const queue_url:string = ( process.env.QUEUE_URL ) ? ( process.env.QUEUE_URL ) : ''
const aws_profile:string = ( process.env.AWS_PROFILE ) ?  ( process.env.AWS_PROFILE ) : 'queue'
const aws_region:string = ( process.env.AWS_REGION ) ?  ( process.env.AWS_REGION ) : 'us-east-1'
const credentials = new AWS.SharedIniFileCredentials({ profile: aws_profile });

// AWS.
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