output "sqs_url_data_source" {
  value = aws_sqs_queue.example-queue.url
}