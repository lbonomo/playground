output "cloudfront_url" {
  description = "Public URL:"
  value       = "https://${aws_cloudfront_distribution.mainpage_distribution.domain_name}"
}
