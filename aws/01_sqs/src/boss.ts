var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({ profile: 'queue' });
AWS.config.credentials = credentials

if (AWS.config.credentials.accessKeyId == undefined) {
    console.log("Please set a AWS profile named 'queue'")
    process.exit()
}

// Set the region ???
AWS.config.update({ region: 'us-east-1' });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
let data = {
    uri: {
        base: "https://example.com/",
        target: "https://stage.example.com/"
    },
    render: {
        cookie_selector: "a#hs-eu-confirmation-button",
        exclude: [
            "#masthead",
            ".site-footer"
        ],
        include: "main"
    },
    auth: {
        type: "basic",
        username: "admin",
        password: "adminPass"
    }
}
var params1 = {
    DelaySeconds: 10,
    MessageBody: JSON.stringify(data),
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/024857090340/terraform-example-queue"
};

sqs.sendMessage(params1, function (err: any, data: any) {
    if (err) {
        console.log(`Error (message: ${data.MessageId}), ${err}`);
    }
});