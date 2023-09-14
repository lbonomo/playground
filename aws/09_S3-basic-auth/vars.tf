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


## Home
variable "origin_id" {
  type        = string
  description = "S3 backet plugins"
  default     = "S3_plugins"
}
