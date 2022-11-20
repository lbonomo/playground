# Serverless Queue
The target of this example is learn about how to use AWS Lambda + SQS

## AWS 

### SAM CLI
 - Install the CLI\
   https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html
   
   ```bash
   $ sam --version
   SAM CLI, version 1.61.0
   ```
 - Config `.aws/config` and `.aws/credentials`

### AWS Toolkit for Visual Studio Code
https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/serverless-apps.html
https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/setup-toolkit.html#setup-prereq

### SQS
https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-sending-messages-from-vpc.html

We need a pair of credentials to access, and we need to config ~./aws files with a "queue" profile.

Step 1: Create an Amazon EC2 key pair
Step 2: Create AWS resources

Step 5: Send a message to your Amazon SQS queue

##### Acerca de las colas
 - Tipo de cola: Standard queues

### Lambda


## Terraform

```bash
$ terraform --version
Terraform v1.3.3
on linux_amd64
```

## Boss
This function enqueue works into the queue.

## Worker
This function listen the queue and do the work.