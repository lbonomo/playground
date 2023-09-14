# Terrarorm
terraform {
  required_version = ">= 0.12"
  required_providers {
    aws = {
      version = ">= 2.7.0"
      source  = "hashicorp/aws"
    }
  }
}

# Provider
provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}
