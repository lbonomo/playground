output "ec2_IP" {
  description = "EC2 Public IP:"
  value       = "http://${aws_instance.web_example.public_ip}"
}

output "ec2_url" {
  description = "EC2 Public DNS:"
  value       = "http://${aws_instance.web_example.public_dns}"
}

output "cloudfront_url" {
  description = "CloudFront direction"
  value       = "http://${aws_cloudfront_distribution.queuauu.domain_name}"
}



