# Provider
variable "aws_profile" {
  type        = string
  description = "AWS profile name"
  # default     = "terraform"
}

variable "aws_region" {
  type        = string
  description = "AWS defaul region"
  default     = "us-east-1"
}


# CNAME

variable "cname" {
  type        = string
  description = "Custom CNAME"
  # default     = "queuauu.com"
}

# Origins
## Domain.
variable "domain_name" {
  type        = string
  description = "Origin WordPress domain"
  default     = "lucasbonomo.com"
}

## Home
variable "origin_id" {
  type        = string
  description = "Home Origin ID"
  default     = "DHome"
}
