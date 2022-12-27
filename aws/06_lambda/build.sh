#! /bin/bash 

# Vars.
outDir='dist'
zipFile='../random.zip'

# Remove previus build folder.
if [ -d $outDir ]
then 
    rm -rf $outDir
fi
npm run build

# Copy node_modules into build to make lambda funtion
cp -r node_modules $outDir
cd $outDir


if [ -f $zipFile ] 
then 
    rm -rf $zipFile
fi
zip -r $zipFile *

cd ..

# # Upload zip file to AWS.
# echo "Upload to AWS"
# aws lambda update-function-code --profile=$aws_profile --function-name=DolArgBot --zip-file fileb://lambda.zip