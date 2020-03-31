#!/bin/sh
export TF_VAR_aws_account_number=$AWS_ACCOUNT_NUMBER
export TF_VAR_lambda_api_layer_package_filename=$(PWD)/node_package-0.1.zip
export TF_VAR_lambda_api_functions_package_filename=$(PWD)/functions_package_0.12.zip
export TF_VAR_env=dev

terraform init && 
    terraform plan -out tfplan && 
    terraform apply tfplan && 
    terraform output -json | jq > iac.json