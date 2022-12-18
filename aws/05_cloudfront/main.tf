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

  ## Origins
  origin {
    domain_name = var.domain_name
    origin_id   = var.home_origin_id
    origin_path = "/queuauu"
    # custom_origin_config: Is necessary if you use a website as origin.  
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "match-viewer"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ## About
  origin {
    domain_name = var.domain_name
    origin_id   = var.about_origin_id
    origin_path = "/queuauu/about"
    # custom_origin_config: Is necessary if you use a website as origin.  
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "match-viewer"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  ## Thanks
  origin {
    domain_name = var.domain_name
    origin_id   = var.thanks_origin_id
    origin_path = "/queuauu/thanks"
    # custom_origin_config: Is necessary if you use a website as origin.  
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "match-viewer"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "queuauu.com -> lucasbonomo.com/queuauu/"

  tags = {
    Creator = "Terraform"
  }

  ## Behavior.

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = var.home_origin_id

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

  # The order is important!

  ## About.
  ordered_cache_behavior {
    path_pattern     = "/about"
    target_origin_id = var.about_origin_id
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  ## Thanks.
  ordered_cache_behavior {
    path_pattern     = "/thanks"
    target_origin_id = var.thanks_origin_id
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
  }

  ## Home.
  ordered_cache_behavior {
    path_pattern     = "/"
    target_origin_id = var.home_origin_id
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD", "OPTIONS"]

    forwarded_values {
      query_string = false
      headers      = ["Origin"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
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
      restriction_type = "whitelist"
      locations        = var.allow_countries
    }
  }

}

