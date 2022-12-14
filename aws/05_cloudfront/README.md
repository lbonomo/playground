# CloudFront 


## Target 

Target is associate a custom WordPress path to a specific domain name with AWS CloudFront

```
https://queuauu.com/        ->  https://[cloudfront-url]/        -> https://lucasbonomo.com/queuauu/
https://queuauu.com/about/  ->  https://[cloudfront-url]/about/  -> https://lucasbonomo.com/queuauu/about/
https://queuauu.com/thanks/ ->  https://[cloudfront-url]/thanks/ -> https://lucasbonomo.com/queuauu/thank-you/
```

## AWS IAM

Is necessary that user has the following permission 
 - `CloudFrontFullAccess`
 - `AWSCertificateManagerFullAccess`
 - `AmazonRoute53FullAccess`  


https://[cloudfront_url] -> https://lucasbonomo.com/queuauu/

## Custom DNS name

To configure a custom `CNAME` in CloudFront, we need to add a SSL/TLS certificate. This Terraform setup include steps necessary to do this.


```
$ terraform apply
var.aws_profile
  AWS profile name

  Enter a value: terraform 

var.cname
  Custom CNAME

  Enter a value: queuauu.com

...

Apply complete! Resources: 3 added, 0 changed, 0 destroyed.

Outputs:

cloudfront_url = "[cloudfront-url]"
```

Finally we need to setup our custom CNAME to CloudFront URL