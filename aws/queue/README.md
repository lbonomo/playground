# Queue
The target of this example is learn about how to use AWS SQS

## SQS
https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-sending-messages-from-vpc.html

We need a pair of credentials to access, and we need to config ~./aws files with a "queue" profile.

Step 1: Create an Amazon EC2 key pair
Step 2: Create AWS resources

Step 5: Send a message to your Amazon SQS queue

### Acerca de las colas
 - Tipo de cola: Standard queues

## Terraform

```bash
$ terraform --version
Terraform v1.3.3
on linux_amd64
```

```bash
$ terraform init
```

```bash
$ terraform plan 
```

```bash
$ terraform apply 
```

## Boss
This function enqueue works into the queue.

## Worker
This function listen the queue and do the work.