# Queue
The target of this example is learn about how to use AWS SQS

## Infrastructure
 - A queue
 - A local process running "boss"
 - Some local process running "worker"
### SQS
https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-sending-messages-from-vpc.html

We need a pair of credentials to access, and we need to config ~./aws files with a "queue" profile.

Step 1: Create an Amazon EC2 key pair
Step 2: Create AWS resources

Step 5: Send a message to your Amazon SQS queue

#### Acerca de las colas
 - Tipo de cola: Standard queues

### Terraform
To use `main.tf` we need an AWS account named `queue`
 
To see the plan, run `terraform plan`
To apply it, run `terraform apply`
To destroy the infrastructure, run `terraform destroy`

## Boss
This function enqueue works into the queue.

## Worker
This function listen the queue and do the work.