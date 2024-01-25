### DNS - Auto validation by DNS
data "aws_route53_zone" "queuauu_acm_verification" {
  name         = var.cname
  private_zone = false
}

resource "aws_route53_record" "queuauu" {
  for_each = {
    for dvo in aws_acm_certificate.queuauu_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.queuauu_acm_verification.zone_id
}


resource "aws_route53_record" "cname" {
  for_each = {
    for dvo in aws_acm_certificate.queuauu_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.queuauu_acm_verification.zone_id
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.queuauu_acm_verification.zone_id
  name    = "www"
  type    = "CNAME"
  ttl     = 300
  records = [ aws_cloudfront_distribution.queuauu.domain_name ]
}
