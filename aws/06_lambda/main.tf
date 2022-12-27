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

output "lambda_random_url" {
  description = "Public URL:"
  value       = aws_lambda_function_url.random_lambda_latest.function_url
}