var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({profile: 'queue'});
AWS.config.credentials = credentials

if ( AWS.config.credentials.accessKeyId == undefined ) {
    console.log("Please set a AWS profile named 'queue'")
    process.exit()
}

// Set the region ???
AWS.config.update({region: 'us-east-1'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
    // Remove DelaySeconds parameter and value for FIFO queues
   DelaySeconds: 10,
   MessageAttributes: {
     "Title": {
       DataType: "String",
       StringValue: "The Whistler"
     },
     "Author": {
       DataType: "String",
       StringValue: "John Grisham"
     },
     "WeeksOn": {
       DataType: "Number",
       StringValue: "6"
     }
   },
   MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
   // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
   // MessageGroupId: "Group1",  // Required for FIFO queues
   QueueUrl: "https://sqs.us-east-1.amazonaws.com/024857090340/terraform-example-queue"
 };
 
 sqs.sendMessage(params, function(err:any, data:any) {
   if (err) {
     console.log("Error", err);
   } else {
     console.log("Success", data.MessageId);
   }
 });