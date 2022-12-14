# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
  profile = "queue"
}

resource "aws_sqs_queue" "example-queue" {
  name                      = "example-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10
  sqs_managed_sse_enabled   = false
  tags = {
    Environment = "production"
  }
  # Get URL al final y setear el .env
}

output "sqs_url_data_source" {
  value = aws_sqs_queue.example-queue.url
}