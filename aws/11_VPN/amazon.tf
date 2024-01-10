# Subnet

# EC2
resource "aws_instance" "app_server" {
  ami           = "ami-0005e0cfe09cc9050"
  instance_type = "t2.nano"

  #   vpc_security_group_ids = ""
  #   subnet_id              = "subnet-923a..."

  tags = {
    Name = "Terraform example"
  }

}

# Cert
### Certificate.

# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/acm_certificate
resource "aws_acm_certificate" "cert_01" {
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
data "aws_route53_zone" "cert_01_verification" {
  name         = var.cname
  private_zone = false
}

resource "aws_route53_record" "cert_01" {
  for_each = {
    for dvo in aws_acm_certificate.cert_01.domain_validation_options : dvo.domain_name => {
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
  zone_id         = data.aws_route53_zone.cert_01_verification.zone_id
}

resource "aws_cloudwatch_log_group" "log_group_vpn" {
  name = "Yada"

  tags = {
    Environment = "production"
    Application = "serviceA"
  }
}

resource "aws_cloudwatch_log_stream" "log_stream_vpn" {
  name           = "SampleLogStream1234"
  log_group_name = aws_cloudwatch_log_group.log_group_vpn.name
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ec2_client_vpn_endpoint
resource "aws_ec2_client_vpn_endpoint" "vpn_example" {
  description            = "terraform-clientvpn-example"
  server_certificate_arn = aws_acm_certificate.cert_01.arn
  client_cidr_block      = "10.135.172.0/22"

  authentication_options {
    type                       = "certificate-authentication"
    root_certificate_chain_arn = "arn:aws:acm:us-east-1:926743415894:certificate/71a3f807-b905-433d-b050-0851387e5534"
  }

  connection_log_options {
    enabled               = true
    cloudwatch_log_group  = aws_cloudwatch_log_group.log_group_vpn.name
    cloudwatch_log_stream = aws_cloudwatch_log_stream.log_stream_vpn.name
  }

}
