# Terrarorm
terraform {
  required_version = ">= 0.12"
  required_providers {
    aws = {
      version = ">= 2.7.0"
      source  = "hashicorp/aws"
    }
  }
}

locals {
  emails = ["lucas@vanguard.com.ar"]
}

# Vars 
variable "zipname" {
  type        = string
  description = "Zip file name"
  default     = "random.zip"
}

# Provider
provider "aws" {
  region  = "us-east-1"
  profile = "terraform"
}

# Role
resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_lambda"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# Resource
resource "aws_lambda_function" "random_lambda" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename         = var.zipname
  source_code_hash = filebase64sha256(var.zipname)
  function_name    = "random"
  handler          = "index.handler"
  runtime          = "nodejs16.x"
  role             = aws_iam_role.iam_for_lambda.arn

    environment {
      variables = {
        WORDS =  "invention,dog,mom,secretary,arm,vest,creature,rings,income,letter,butter,jellyfish"
      }
    }
}

resource "aws_lambda_function_url" "random_lambda_latest" {
  function_name      = aws_lambda_function.random_lambda.function_name
  authorization_type = "NONE"
}

## SNS
resource "aws_sns_topic" "lambda_random_topic" {
  name = "lambda-random-topic"
}

resource "aws_sns_topic_subscription" "sns-topic" {
  count     = length(local.emails)
  topic_arn = aws_sns_topic.lambda_random_topic.arn
  protocol  = "email"
  endpoint  = local.emails[count.index]
}

## Cloudwatch
resource "aws_cloudwatch_metric_alarm" "lambda_random_app" {
  alarm_name                = "lambda_random_app"
  comparison_operator       = "GreaterThanOrEqualToThreshold"
  evaluation_periods        = 1
  metric_name               = "Invocations"
  namespace                 = "AWS/Lambda"
  period                    = 120
  statistic                 = "Sum"
  threshold                 = 5
  alarm_description         = "Randon APP invocations"
  actions_enabled           = "true"
  alarm_actions             = [aws_sns_topic.lambda_random_topic.arn]
  insufficient_data_actions = []
}

## Outputs
output "lambda_random_url" {
  description = "Public URL:"
  value       = aws_lambda_function_url.random_lambda_latest.function_url
}