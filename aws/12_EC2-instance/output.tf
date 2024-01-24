output "cloudfront_url" {
  description = "Public URL:"
  value       = "http://${aws_instance.web.public_ip}"
}
