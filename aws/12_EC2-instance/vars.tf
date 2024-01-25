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