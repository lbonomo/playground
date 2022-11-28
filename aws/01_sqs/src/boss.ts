import AWS from 'aws-sdk';
import * as dotenv from 'dotenv'
import {nanoid} from 'nanoid';

// Environment vars
dotenv.config()
let queue_url:string = ''
if ( process.env.QUEUE_URL ) {
    queue_url = process.env.QUEUE_URL
}

const credentials = new AWS.SharedIniFileCredentials({ profile: 'queue' });
AWS.config.credentials = credentials

if (AWS.config.credentials.accessKeyId == undefined) {
    console.log("Please set a AWS profile named 'queue'")
    process.exit()
}

// Set the region ???
AWS.config.update({ region: 'us-east-1' });

/**
 * Get messages form Bacon Ipsum.
 * 
 * @returns Messages
 */
async function getLorem() {
    let messages:string[] = []
    const url = 'https://baconipsum.com/api/?type=all-meat'

    // Make a request for a user with a given ID
    let response = await fetch(url)
    if (response.ok) {
        messages = await response.json();
    } else {
        messages = []
    }
    
    return messages
}


/**
 * Main function.
 */
async function main() {

    const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
    const messages = await getLorem()
    for (let message in messages) {
        
        let data = {
            id: nanoid(9),
            datetime: Date.now(),
            message: messages[message]
        }
        
        const params = {
            DelaySeconds: 10,
            MessageBody: JSON.stringify(data),
            QueueUrl: queue_url
        };

        sqs.sendMessage(params, function (err: any, data: any) {
            console.log(`Added message: ${data.MessageId}`)
            if (err) {
                console.log(`Error (message: ${data.MessageId}), ${err}`);
            }
        });
    }
}

main()