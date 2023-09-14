# S3 Bucket
resource "aws_s3_bucket" "this" {
    bucket = "wordpress-plugins-storage"
    tags = {
        Creator = "Terraform"
        Environment = "Dev"
    }
}

resource "aws_s3_bucket_public_access_block" "plugins" {
  bucket = aws_s3_bucket.this.id
  
  tags = {
    Creator = "Terraform"
  }

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}



# ---------------------------------------------------------------------------------------------------------------------
# Bucket policy to allow CloudFront to read from this bucket
# Provider Docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy
# ---------------------------------------------------------------------------------------------------------------------

resource "aws_s3_bucket_policy" "this" {
  bucket = var.bucket_id
  policy = data.aws_iam_policy_document.this.json
}

# ---------------------------------------------------------------------------------------------------------------------
# Policy document to be used as S3 bucket policy.  Allows origin access identity to read from S3 bucket
# Provider Docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/s3_bucket_policy
# ---------------------------------------------------------------------------------------------------------------------

data "aws_iam_policy_document" "this" {
  version = "2008-10-17"
  statement {
    effect = "Allow"
    principals {
      type = "AWS"
      identifiers = [
        aws_cloudfront_origin_access_identity.this.iam_arn
      ]
    }
    actions   = ["s3:GetObject"]
    resources = ["${var.bucket_arn}/*"]
  }

  statement {
    actions   = ["s3:ListBucket"]
    resources = [var.bucket_arn]

    principals {
      type = "AWS"
      identifiers = [
        aws_cloudfront_origin_access_identity.this.iam_arn
      ]
    }
  }
}