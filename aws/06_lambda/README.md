# Lambda function example + Terraform

## Target
Deploy a AWS Lambda function automatically.


## .env

Into `.env` file there are some variable, that we use in local or remote

## To init
 - Run `npm install`
 - Run `terraform init`

## To deploy
 - Run `build.sh` script
 - Run `terraform apply`

## To destroy
 - Run `terraform destroy`

## AWS

### CloudFront
https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/aws-services-cloudwatch-metrics.html
https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html

## Troubleshooting
In some case we can get this error 

```
aws_iam_role.iam_for_lambda: Creating...
╷
│ Error: failed creating IAM Role (iam_for_lambda): EntityAlreadyExists: Role with name iam_for_lambda already exists.
│ 	status code: 409, request id: 53482ad6-e6e2-4c41-b616-48f2da5be8da
│ 
│   with aws_iam_role.iam_for_lambda,
│   on main.tf line 31, in resource "aws_iam_role" "iam_for_lambda":
│   31: resource "aws_iam_role" "iam_for_lambda" {
│ 
╵
```

To fix it we need to run the folowing command

`terraform import aws_iam_role.iam_for_lambda iam_for_lambda`
