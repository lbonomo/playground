# Vars 
variable "zipname" {
  type        = string
  description = "Zip file name"
  default     = "lambda.zip"
}

# Provider
provider "aws" {
  region  = "us-east-1"
  profile = "terraform"
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda-flask-exec"
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

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "flask_api" {
  filename         = var.zipname
  function_name    = "flask-api"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "wsgi.handler"
  source_code_hash = filebase64sha256("lambda.zip")
  runtime          = "python3.11"
  timeout          = 30
  tags = {
    project        = "nomada"
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "flask-api-http"
  protocol_type = "HTTP"
  tags = {
    project        = "nomada"
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.flask_api.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.flask_api.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value = aws_apigatewayv2_api.api.api_endpoint
}