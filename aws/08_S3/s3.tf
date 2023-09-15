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

resource "aws_s3_bucket_public_access_block" "plugins" {
  bucket = aws_s3_bucket.plugins.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


resource "aws_s3_bucket_policy" "allow_public_access" {
  bucket = aws_s3_bucket.plugins.id
  policy = data.aws_iam_policy_document.allow_public_access.json
}

# 
data "aws_iam_policy_document" "allow_public_access" {
  statement {

    principals {
	    type = "*"
	    identifiers = ["*"]
	  }

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
    ]

    resources = [
      aws_s3_bucket.plugins.arn,
      "${aws_s3_bucket.plugins.arn}/*",
    ]
  }
}