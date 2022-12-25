# Terrarorm
terraform {
  required_version = ">= 0.12"
  required_providers {
    aws = {
      version = ">= 2.7.0"
      source  = "hashicorp/aws"
    }
  }
}

# Provider
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

# Resource

# CloudFront - Distribution
resource "aws_cloudfront_distribution" "queuauu_distribution" {

  enabled         = true
  is_ipv6_enabled = true
  comment         = "queuauu.com -> lucasbonomo.com/queuauu/"

  tags = {
    Creator = "Terraform"
  }

  ## Origins
  origin {
    domain_name = var.domain_name
    origin_id   = var.origin_id
    origin_path = "/queuauu"
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
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # CNAME + SSL
  viewer_certificate {
    # Specify this, acm_certificate_arn.
    cloudfront_default_certificate = false
    acm_certificate_arn = aws_acm_certificate.queuauu_cert.arn
    # Required if you specify acm_certificate_arn.
    ssl_support_method  = "sni-only"
  }

  aliases = [var.cname]


  # Other required blocks 
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

}

