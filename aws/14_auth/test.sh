#!/bin/bash
# Test script for Hello World API with IAM authentication

set -e

echo "=========================================="
echo "Hello World API - IAM Auth Test Script"
echo "=========================================="
echo ""

# Get outputs from Terraform
cd terraform

echo "[1] Fetching Terraform outputs..."
API_URL=$(terraform output -raw api_gateway_url)
API_ID=$(terraform output -raw api_gateway_id)
RESOURCE_ID=$(terraform output -raw api_gateway_resource_id)
AWS_ACCOUNT_ID=$(terraform output -raw aws_account_id)
REGION="${AWS_REGION:-us-east-1}"

echo "✓ API URL: $API_URL"
echo "✓ API ID: $API_ID"
echo "✓ Resource ID: $RESOURCE_ID"
echo "✓ Account ID: $AWS_ACCOUNT_ID"
echo "✓ Region: $REGION"
echo ""

echo "[0] Validating AWS credentials..."
if CALLER_ARN=$(aws sts get-caller-identity --query 'Arn' --output text --region "$REGION" 2>/dev/null); then
  AWS_AUTH_OK=true
  echo "✓ AWS credentials are valid: $CALLER_ARN"
else
  AWS_AUTH_OK=false
  echo "! AWS credentials are missing or invalid"
  echo "  Authenticated AWS CLI tests will be skipped"
fi
echo ""

# Test 1: Unauthenticated request (should fail)
echo "[2] Testing unauthenticated POST request (should fail with 403)..."
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/hello" \
  -H "Content-Type: application/json" 2>&1 || true)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo "Response Code: $HTTP_CODE"
echo "Response Body: $BODY"

if [ "$HTTP_CODE" = "403" ]; then
  echo "✓ Correctly rejected unauthenticated request"
else
  echo "✗ Expected 403, got $HTTP_CODE"
fi
echo ""

# Test 2: Authenticated request via test-invoke-method
echo "[3] Testing authenticated request via AWS API Gateway test..."
if [ "$AWS_AUTH_OK" = true ]; then
  if TEST_RESPONSE=$(aws apigateway test-invoke-method \
    --rest-api-id "$API_ID" \
    --resource-id "$RESOURCE_ID" \
    --http-method POST \
    --region "$REGION" 2>&1); then
    STATUS=$(echo "$TEST_RESPONSE" | grep -o '"status": [0-9]*' | grep -o '[0-9]*')
    BODY=$(echo "$TEST_RESPONSE" | grep -o '"body": "[^"]*"' | cut -d'"' -f4)

    echo "Response Status: $STATUS"
    echo "Response Body: $BODY"

    if [ "$STATUS" = "200" ]; then
      echo "✓ Authenticated request successful"
      if echo "$BODY" | grep -q "Hello World"; then
        echo "✓ Response contains 'Hello World'"
      fi
    else
      echo "✗ Expected 200, got $STATUS"
    fi
  else
    echo "✗ API Gateway test-invoke-method failed"
    echo "$TEST_RESPONSE"
  fi
else
  echo "- Skipped: AWS credentials are not valid"
fi
echo ""

# Test 3: Lambda direct invocation
echo "[4] Testing Lambda direct invocation..."
if [ "$AWS_AUTH_OK" = true ]; then
  if LAMBDA_RESPONSE=$(aws lambda invoke \
    --function-name hello-world \
    --region "$REGION" \
    --log-type Tail \
    /tmp/lambda_response.json 2>&1); then
    LAMBDA_BODY=$(cat /tmp/lambda_response.json)
    echo "Lambda Response: $LAMBDA_BODY"

    if echo "$LAMBDA_BODY" | grep -q "Hello World"; then
      echo "✓ Lambda function returned 'Hello World'"
    else
      echo "✗ Lambda response did not contain expected text"
    fi
  else
    echo "✗ Lambda invoke failed"
    echo "$LAMBDA_RESPONSE"
  fi
else
  echo "- Skipped: AWS credentials are not valid"
fi
echo ""

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo "✓ API Gateway: $API_URL"
echo "✓ Lambda Function: hello-world"
echo "✓ IAM Authentication: Enabled (AWS_IAM)"
echo ""
echo "To make authenticated requests, use:"
echo "  aws apigateway test-invoke-method --rest-api-id $API_ID --resource-id $RESOURCE_ID --http-method POST --region $REGION"
echo ""
echo "Or use boto3/SDK to sign requests with AWS credentials"
