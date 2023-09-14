# S3 Bucket
resource "aws_s3_bucket" "plugins" {
    bucket = "wordpress-plugins-storage"
    tags = {
        Creator = "Terraform"
        Environment = "Dev"
    }
  lifecycle {
    prevent_destroy = true
  }
}

# resource "aws_s3_bucket_public_access_block" "plugins" {
#   bucket = aws_s3_bucket.plugins.id
  
#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
# }

# resource "aws_s3_bucket_policy" "plugins" {
#   bucket = var.bucket_id
#   policy = data.aws_iam_policy_document.plugins.json
# }

# data "aws_iam_policy_document" "plugins" {
#   version = "2008-10-17"

#   statement {
#     actions   = ["s3:ListBucket"]
#     resources = [var.bucket_arn]

#     principals {
#       type = "AWS"
#       identifiers = [
#         aws_cloudfront_origin_access_identity.this.iam_arn
#       ]
#     }
#   }
# }