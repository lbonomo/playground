#!/bin/bash
set -e

# Remove old build artifacts and zip file.
rm -rf build
rm lambda.zip

# Create a new build directory, install dependencies, and package the application.|
mkdir build
pip install -r src/requirements.txt -t build/
cp src/app.py src/wsgi.py build/
cd build
zip -r ../lambda.zip .
cd ..

# Deploy the Lambda function using Terraform.
terraform apply
