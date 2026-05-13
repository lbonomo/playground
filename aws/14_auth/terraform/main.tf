# Data source to get current AWS account ID
data "aws_caller_identity" "current" {}

# Archive the Lambda function code
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file = "${path.module}/../lambda/handler.py"
  output_path = "${path.module}/.terraform/lambda_function.zip"
}

# Lambda Function
resource "aws_lambda_function" "hello_world" {
  function_name = var.lambda_function_name
  role          = aws_iam_role.lambda_role.arn
  handler       = "handler.lambda_handler"
  runtime       = var.lambda_runtime
  timeout       = var.lambda_timeout
  memory_size   = var.lambda_memory

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT = var.environment
    }
  }

  depends_on = [aws_iam_role_policy_attachment.lambda_basic_execution]
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "hello_world_api" {
  name = var.api_name

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# API Gateway Resource (/)
resource "aws_api_gateway_resource" "root" {
  rest_api_id = aws_api_gateway_rest_api.hello_world_api.id
  parent_id   = aws_api_gateway_rest_api.hello_world_api.root_resource_id
  path_part   = "hello"
}

# API Gateway Method (POST) with AWS_IAM authorization
resource "aws_api_gateway_method" "post_hello" {
  rest_api_id      = aws_api_gateway_rest_api.hello_world_api.id
  resource_id      = aws_api_gateway_resource.root.id
  http_method      = "POST"
  authorization    = "AWS_IAM"
  api_key_required = false
}

# API Gateway Lambda Integration
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.hello_world_api.id
  resource_id             = aws_api_gateway_resource.root.id
  http_method             = aws_api_gateway_method.post_hello.http_method
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.hello_world.invoke_arn

  depends_on = [aws_lambda_permission.api_gateway]
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "hello_world_api" {
  rest_api_id = aws_api_gateway_rest_api.hello_world_api.id
  stage_name  = var.environment

  depends_on = [
    aws_api_gateway_integration.lambda_integration,
    aws_api_gateway_method.post_hello
  ]
}
