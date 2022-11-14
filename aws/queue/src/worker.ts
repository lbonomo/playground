var AWS = require('aws-sdk');

var credentials = new AWS.SharedIniFileCredentials({ profile: 'queue' });
AWS.config.credentials = credentials
let region = 'us-east-1'
let queueURL = 'https://sqs.us-east-1.amazonaws.com/024857090340/terraform-example-queue'

AWS.config.update({ region: region });
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

let params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
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
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        console.log(body)

        sqs.deleteMessage(deleteParams, function (err: any, data: any) {
            if (err) {
                console.log(`Delete Error ${err} \n "Message: ${data}`);
            }
        });
    }
});