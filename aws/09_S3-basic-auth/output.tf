output "cloudfront_url" {
  description = "Public URL:"
  value       = "https://${aws_cloudfront_distribution.queuauu_distribution.domain_name}"
}
