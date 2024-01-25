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