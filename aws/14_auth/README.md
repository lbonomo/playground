# Hello World API - AWS Lambda with IAM Authentication

A serverless application built with AWS Lambda, API Gateway with AWS IAM authentication, deployed using Terraform.

## Architecture

- **Lambda Function**: Python handler returning "Hello World" JSON response
- **API Gateway**: REST API endpoint with AWS_IAM authorization
- **IAM Authentication**: All POST requests to `/hello` must be signed with AWS credentials
- **Terraform**: Infrastructure as Code for reproducible deployments

## Prerequisites

1. **AWS Account**: Active AWS credentials configured locally
   ```bash
   aws configure
   ```

2. **Terraform**: Version >= 1.0
   ```bash
   terraform version
   ```

3. **Python**: Version >= 3.11 (for the Lambda runtime)

4. **AWS CLI**: For testing authenticated requests
   ```bash
   aws --version
   ```

## Project Structure

```
.
├── lambda/
│   └── handler.py              # Lambda function code
├── terraform/
│   ├── provider.tf             # AWS provider configuration
│   ├── main.tf                 # Lambda, API Gateway, integrations
│   ├── iam.tf                  # IAM roles and policies
│   ├── variables.tf            # Input variables
│   └── outputs.tf              # Output values
└── README.md                   # This file
```

## Deployment

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Plan the Deployment

```bash
terraform plan -out=tfplan
```

This will show you what resources will be created:
- Lambda function with IAM execution role
- API Gateway REST API
- API resource and POST method with AWS_IAM authorization
- CloudWatch log group for Lambda

### 3. Apply the Configuration

```bash
terraform apply tfplan
```

### 4. Capture Outputs

After deployment completes, note the outputs:

```bash
terraform output
```

Important values:
- `api_gateway_url`: The base URL of your API
- `lambda_function_name`: Your Lambda function name
- `aws_account_id`: Your AWS account ID

## Testing

### Quick curl example

Run from the project root:

```bash
API_URL=$(cd terraform && terraform output -raw api_gateway_url)
REGION="us-east-1"

# Load credentials from your configured AWS CLI profile
# aws configure

# Signed request (AWS_IAM) -> expected 200
curl -sS -X POST "${API_URL}/hello" \
  -H "Content-Type: application/json" \
  --aws-sigv4 "aws:amz:${REGION}:execute-api" \
  --user "${AWS_ACCESS_KEY_ID}:${AWS_SECRET_ACCESS_KEY}"

# Unauthenticated request -> expected 403
curl -i -X POST "${API_URL}/hello" -H "Content-Type: application/json"
```

### Test 1: Unauthenticated Request (Should Fail - 403)

```bash
curl -X POST https://<api_id>.execute-api.<region>.amazonaws.com/dev/hello \
  -H "Content-Type: application/json"
```

Expected response: **Forbidden (403)**

### Test 2: Authenticated Request (Should Succeed - 200)

Use AWS CLI to sign the request:

```bash
# Set your endpoint
ENDPOINT=$(terraform output -raw api_gateway_url)
REGION="us-east-1"  # Match your deployed region

# Make authenticated request
curl -X POST "${ENDPOINT}/hello" \
  -H "Content-Type: application/json" \
  --aws-sigv4 "aws:amz:${REGION}:execute-api" \
  --user "$(aws configure get aws_access_key_id):$(aws configure get aws_secret_access_key)"
```

Or using AWS CLI directly:

```bash
aws lambda invoke \
  --function-name hello-world \
  --region us-east-1 \
  response.json

cat response.json
```

### Test 3: Using Python boto3

Create `test_api.py`:

```python
import boto3
import json
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest

session = boto3.Session()
credentials = session.get_credentials()

url = "https://<api_id>.execute-api.us-east-1.amazonaws.com/dev/hello"
request = AWSRequest(method='POST', url=url)
SigV4Auth(credentials, 'execute-api', 'us-east-1').add_auth(request)

response = boto3.client('apigateway').test_invoke_method(
    restApiId='<api_id>',
    resourceId='<resource_id>',
    httpMethod='POST',
    pathWithQueryString='/hello'
)

print(json.dumps(response, indent=2, default=str))
```

### Test 4: AWS CLI Direct Invocation

```bash
aws apigateway test-invoke-method \
  --rest-api-id <api_id> \
  --resource-id <resource_id> \
  --http-method POST \
  --region us-east-1
```

## IAM Authorization Details

### How It Works

1. **Request Signing**: Client signs request with AWS SigV4 using their credentials
2. **API Gateway Validation**: Verifies the signature matches the Authorization header
3. **IAM Policy Check**: Ensures caller has permission to `execute-api:Invoke`
4. **Lambda Invocation**: If authorized, API Gateway invokes Lambda function

### Authorization Header Format

```
Authorization: AWS4-HMAC-SHA256 
  Credential=AKIAIOSFODNN7EXAMPLE/20260510/us-east-1/execute-api/aws4_request, 
  SignedHeaders=content-type;host;x-amz-date, 
  Signature=...
```

### Required IAM Permissions

To invoke this API, the caller needs:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:us-east-1:123456789012:abcd1234/dev/POST/hello"
    }
  ]
}
```

## Configuration

Modify deployment settings in `terraform/variables.tf`:

- `aws_region`: Change deployment region
- `environment`: Environment name (dev, staging, prod)
- `lambda_timeout`: Lambda timeout in seconds
- `lambda_memory`: Lambda memory in MB
- `lambda_runtime`: Python version

Override with:

```bash
terraform apply -var="environment=prod" -var="lambda_memory=256"
```

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

## Lambda Logs

View Lambda execution logs:

```bash
aws logs tail /aws/lambda/hello-world --follow
```

## Monitoring

### CloudWatch Metrics

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=hello-world \
  --statistics Sum \
  --start-time 2026-05-10T00:00:00Z \
  --end-time 2026-05-10T23:59:59Z \
  --period 3600
```

### API Gateway Metrics

```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value=hello-world-api \
  --statistics Sum \
  --start-time 2026-05-10T00:00:00Z \
  --end-time 2026-05-10T23:59:59Z \
  --period 3600
```

## AWS Credentials

### How to Get AWS Credentials

Your curl command needs `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

#### IAM User with Static Credentials

```bash
# Configure static credentials
aws configure

# This stores credentials in ~/.aws/credentials
```

### Verify Your Credentials

```bash
# Check which AWS identity you're using
aws sts get-caller-identity

# Output should show:
# {
#   "UserId": "...",
#   "Account": "123456789012",
#   "Arn": "arn:aws:iam::123456789012:user/your-name"
# }
```

## Troubleshooting

### "Signature does not match" Error

- Ensure AWS credentials are correct and have not expired
- Verify region matches API Gateway deployment region
- Check that datetime is synchronized with AWS

### "Forbidden" Response

- Verify IAM user/role has `execute-api:Invoke` permission
- Check the resource ARN in the policy matches exactly

### Lambda Timeout

- Increase `lambda_timeout` in variables
- Check CloudWatch logs for actual execution time

### API Gateway 404

- Verify resource path matches: `/hello`
- Check HTTP method is POST
- Ensure deployment was successful

## Using from WordPress (GoDaddy, Shared Hosting, etc.)

### Setup: Store AWS Credentials in wp-config.php

Add to your `wp-config.php` before `/* That's all, stop editing! */`:

```php
// AWS Credentials (use static credentials for shared hosting)
define('AWS_ACCESS_KEY_ID', 'AKIA...');           // Your IAM user access key
define('AWS_SECRET_ACCESS_KEY', '...');           // Your IAM user secret key
define('AWS_REGION', 'us-east-1');               // Match your API region
define('AWS_API_ENDPOINT', 'https://oijh69vkf0.execute-api.us-east-1.amazonaws.com/dev');
```

### Step 1: Add SigV4 Signing Function to Your Theme

Add to `wp-content/themes/your-theme/functions.php` or a custom plugin:

```php
<?php
/**
 * Sign AWS API Gateway request with SigV4
 */
function aws_sigv4_sign_request($method = 'POST', $path = '/hello', $body = '') {
    $host = parse_url(AWS_API_ENDPOINT, PHP_URL_HOST);
    $region = AWS_REGION;
    $service = 'execute-api';
    $algorithm = 'AWS4-HMAC-SHA256';
    $amzdate = gmdate('Ymd\THis\Z');
    $datestamp = gmdate('Ymd');
    
    // Canonical Request
    $canonical_uri = $path;
    $canonical_headers = "host:{$host}\nx-amz-date:{$amzdate}\n";
    $signed_headers = "host;x-amz-date";
    
    $payload_hash = hash('sha256', $body ?: '');
    $canonical_request = "{$method}\n{$canonical_uri}\n\n{$canonical_headers}\n{$signed_headers}\n{$payload_hash}";
    
    // String to Sign
    $canonical_request_hash = hash('sha256', $canonical_request);
    $credential_scope = "{$datestamp}/{$region}/{$service}/aws4_request";
    $string_to_sign = "{$algorithm}\n{$amzdate}\n{$credential_scope}\n{$canonical_request_hash}";
    
    // Calculate Signature
    $k_date = hash_hmac('sha256', $datestamp, 'AWS4' . AWS_SECRET_ACCESS_KEY, true);
    $k_region = hash_hmac('sha256', $region, $k_date, true);
    $k_service = hash_hmac('sha256', $service, $k_region, true);
    $k_signing = hash_hmac('sha256', 'aws4_request', $k_service, true);
    $signature = bin2hex(hash_hmac('sha256', $string_to_sign, $k_signing, true));
    
    // Authorization Header
    $authorization = "{$algorithm} Credential=" . AWS_ACCESS_KEY_ID . "/{$credential_scope}, SignedHeaders={$signed_headers}, Signature={$signature}";
    
    return [
        'Authorization' => $authorization,
        'X-Amz-Date' => $amzdate,
    ];
}

/**
 * Call AWS Lambda API from WordPress
 */
function call_aws_lambda_api($message = 'Hello from WordPress') {
    $path = '/hello';
    $body = wp_json_encode(['message' => $message]);
    
    // Get signed headers
    $headers = aws_sigv4_sign_request('POST', $path, $body);
    $headers['Content-Type'] = 'application/json';
    
    // Make request with wp_remote_post
    $response = wp_remote_post(AWS_API_ENDPOINT . $path, [
        'headers' => $headers,
        'body' => $body,
        'timeout' => 10,
        'sslverify' => true,
    ]);
    
    if (is_wp_error($response)) {
        return ['error' => $response->get_error_message()];
    }
    
    $status = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    
    return [
        'status' => $status,
        'body' => json_decode($body, true),
    ];
}
?>
```

### Step 2: Use in Your WordPress Site

**Example 1: In a Shortcode**

```php
<?php
function aws_lambda_shortcode() {
    $result = call_aws_lambda_api('Hello from my WordPress site!');
    
    if (isset($result['error'])) {
        return 'Error: ' . esc_html($result['error']);
    }
    
    return wp_json_encode($result);
}
add_shortcode('aws_lambda', 'aws_lambda_shortcode');
?>
```

Use in your page/post:

```
[aws_lambda]
```

**Example 2: In a Template**

```php
<?php
$result = call_aws_lambda_api();
if ($result['status'] === 200) {
    echo 'Lambda Response: ' . esc_html(wp_json_encode($result['body']));
}
?>
```

### Step 3: Verify IAM User Permissions

Your IAM user needs this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:us-east-1:123456789012:oijh69vkf0/dev/POST/hello"
    }
  ]
}
```

Replace:
- `123456789012` with your AWS Account ID
- `oijh69vkf0` with your API Gateway ID
- `us-east-1` with your region

---

## Additional Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway Authorization](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies.html)
- [AWS SigV4 Signing](https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
