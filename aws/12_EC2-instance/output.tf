output "cloudfront_url" {
  description = "Public IP:"
  value       = "http://${aws_instance.web_example.public_ip}"
}
