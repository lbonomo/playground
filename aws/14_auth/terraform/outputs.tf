output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.hello_world.function_name
}

output "lambda_function_arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.hello_world.arn
}

output "api_gateway_url" {
  description = "API Gateway endpoint URL"
  value       = aws_api_gateway_deployment.hello_world_api.invoke_url
}

output "api_gateway_id" {
  description = "API Gateway REST API ID"
  value       = aws_api_gateway_rest_api.hello_world_api.id
}

output "api_gateway_resource_id" {
  description = "API Gateway resource ID"
  value       = aws_api_gateway_resource.root.id
}

output "iam_role_arn" {
  description = "IAM role ARN for Lambda execution"
  value       = aws_iam_role.lambda_role.arn
}

output "aws_account_id" {
  description = "AWS Account ID"
  value       = data.aws_caller_identity.current.account_id
}
