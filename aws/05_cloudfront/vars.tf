# Provider
variable "aws_profile" {
  type        = string
  description = "AWS profile name"
  default     = "terraform"
}

variable "aws_region" {
  type        = string
  description = "AWS defaul region"
  default     = "us-east-1"
}

# General
variable "allow_countries" {
  type        = list(any)
  description = "List of allow countries"
  default     = ["US", "CA", "GB", "DE", "AR"]
}

# CNAME

variable "cname" {
  type        = string
  description = "Target domain"
  default     = "queuauu.com"
}

# Origins
## Domain.
variable "domain_name" {
  type        = string
  description = "The domain name to use"
  default     = "lucasbonomo.com"
}

## Home
variable "home_origin_id" {
  type        = string
  description = "Home Origin ID"
  default     = "Home"
}

## About
variable "about_origin_id" {
  type        = string
  description = "About Origin ID"
  default     = "About"
}

## Thanks.
variable "thanks_origin_id" {
  type        = string
  description = "About Origin ID"
  default     = "Thanks"
}
