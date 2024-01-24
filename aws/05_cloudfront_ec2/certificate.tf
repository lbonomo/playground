### Certificate.

# data "aws_acm_certificate" "queuauu_cert" {
#   domain = var.cname
# }

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate
resource "aws_acm_certificate" "queuauu_cert" {
  domain_name       = var.cname
  validation_method = "DNS" # "EMAIL"
  tags = {
    Creator = "Terraform"
  }

  lifecycle {
    create_before_destroy = true
  }
}

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
