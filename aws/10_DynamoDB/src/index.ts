import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import 'dotenv/config'
import { v4 as uuid } from 'uuid';

// const client = new DynamoDBClient({});
const client = new DynamoDBClient({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID as string,
        secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
      },
    region: "us-east-1",
});

const addUser = async (userID: string) => {

    const command = new PutItemCommand({
        TableName: "GameScores",
        Item: {
            id: { S: uuid() },
            username: { S: userID }

        },
    });

    const data = await client.send(command);
    console.log(data);
    return data;
}

addUser( 'lbonomo' )
