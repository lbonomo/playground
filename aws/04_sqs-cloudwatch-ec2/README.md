# SQS + Cloudwatch + EC2
The goal of this example is wake up one or more EC2 instance when the SQS queue has a message.

## Docker
https://docs.docker.com/cloud/ecs-integration/
To build the image `docker build . -t worker`
To run the image `docker run worker:latest`

## Amazon ECR 
[Amazon Elastic Container Registry](https://aws.amazon.com/es/ecr/)

- Login 
  `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 024857090340.dkr.ecr.us-east-1.amazonaws.com`
- Build
  `docker build -t playgound .`
- Tag image
  `docker tag playgound:latest 024857090340.dkr.ecr.us-east-1.amazonaws.com/playgound:latest`
- Push image
  `docker push 024857090340.dkr.ecr.us-east-1.amazonaws.com/playgound:latest`

## Amazon ECS
`024857090340.dkr.ecr.us-east-1.amazonaws.com/playgound:latest`

### AWS Fargate

We can use Spot instances.

## Run EC2 from Docker image
## Infrastructure.

### SQS




## Documentation
https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html
https://docs.docker.com/cloud/ecs-integration/



Fargate