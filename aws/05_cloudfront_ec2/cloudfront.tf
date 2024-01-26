# Resource

# Get data Cache policy
data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

# Get data origin request policy
data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

# CloudFront - Distribution
resource "aws_cloudfront_distribution" "queuauu" {
  enabled         = true
  is_ipv6_enabled = true
  comment         = "www.queuauu.com -> [ec2_url]"
  aliases = [var.cname]
  tags = {
    Creator = "Terraform"
  }

  ## Origins
  origin {
    domain_name = aws_instance.web_example.public_dns
    origin_id   = var.origin_id
    origin_path = ""
    # custom_origin_config: Is necessary if you use a website as origin.  
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "match-viewer"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ## Behavior.
  default_cache_behavior {
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = var.origin_id
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # CNAME + SSL
  viewer_certificate {
    # Specify this, acm_certificate_arn.
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate.queuauu_cert.arn
    # Required if you specify acm_certificate_arn.
    ssl_support_method = "sni-only"
  }

  # Other required blocks 
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

}
