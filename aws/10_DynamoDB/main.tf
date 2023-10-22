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
  region  = "us-east-1"
  profile = "terraform"
}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "GameScores"
  billing_mode   = "PAY_PER_REQUEST"
  # read_capacity  = 20
  # write_capacity = 20
  hash_key       = "id"
  range_key      = "username"

    attribute {
        name = "id"
        type = "S"
    }

    attribute {
      name="username"
      type="S"
    }
}