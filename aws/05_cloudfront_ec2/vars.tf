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

# CNAME
variable "cname" {
  type        = string
  description = "Custom CNAME"
  default     = "queuauu.com"
}

# Origins

## Home
variable "origin_id" {
  type        = string
  description = "Home Origin ID"
  default     = "DHome"
}

## VPC
variable "public_subnet_cidr" {
  type        = string
  description = "Public subnet"
  default     = "178.0.10.0/24"  
}

variable "vpc_cidr" {
  type        = string
  description = "Public subnet"
  default     = "178.0.0.0/16"  
}