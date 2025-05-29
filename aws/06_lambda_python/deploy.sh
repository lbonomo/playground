#!/bin/bash
set -e

rm -rf build
mkdir build
pip install -r src/requirements.txt -t build/
cp src/app.py src/wsgi.py build/
cd build
zip -r ../lambda.zip .
cd ..