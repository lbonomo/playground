
## Target
The target of this example is learn more about the Docker into AWS Lambda.

https://docs.aws.amazon.com/lambda/latest/dg/images-create.html
https://docs.aws.amazon.com/lambda/latest/dg/typescript-image.html


## Make image
 - https://hub.docker.com/r/amazon/aws-lambda-nodejs
 - https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-create.html
 - https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
 

Make image `docker build -t queue-docker .`

Run container `docker run -p 9000:8080 queue-docker:latest`

To test `curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'`
https://earthly.dev/blog/aws-lambda-docker/