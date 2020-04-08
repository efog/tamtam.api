#!/bin/sh
export AWS_DEFAULT_REGION=us-east-1
export TF_VAR_aws_account_number=$AWS_ACCOUNT_NUMBER
export TF_VAR_lambda_api_layer_package_filename=$(pwd)/node_package_0.5.zip
export TF_VAR_lambda_api_functions_package_filename=$(pwd)/functions_package_0.19.zip
export TF_VAR_env=dev
export TF_VAR_region=us-east-1

terraform init && 
    terraform destroy
    