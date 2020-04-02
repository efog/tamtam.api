#!/bin/sh
export AWS_DEFAULT_REGION=ca-central-1
export TF_VAR_aws_account_number=$AWS_ACCOUNT_NUMBER
export TF_VAR_lambda_api_layer_package_filename=$(pwd)/node_package_0.2.zip
export TF_VAR_lambda_api_functions_package_filename=$(pwd)/functions_package_0.17.zip
export TF_VAR_env=dev
export TF_VAR_region=ca-central-1

terraform init && 
    terraform plan -out tfplan && 
    terraform apply tfplan