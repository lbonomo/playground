# CloudFront - Distribution
resource "aws_cloudfront_distribution" "wordpress_plugins_storage" {

  enabled         = true
  is_ipv6_enabled = true
  comment         = "WordPress plugins storage"

  tags = {
    Creator = "Terraform"
  }

  ## Origins
  origin {
    origin_id   = var.origin_id
    origin_path = "/queuauu"
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
    cloudfront_default_certificate = true
  }


  # Other required blocks 
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

}

