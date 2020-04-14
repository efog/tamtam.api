provider "aws" {
  region  = "us-east-1"
  alias   = "cac1"
  version = "~> 2.7"
}

terraform {
  backend "s3" {
    bucket = "locomotive10.iac.use1.terraform"
    key    = "tamtam.dev.tfstate"
    region = "us-east-1"
  }
}

variable region {
  default = "us-east-1"
}

variable env {
  default = "dev"
}

variable aws_account_number {
  default = "123456789012"
}

variable lambda_api_layer_package_filename {
  default = "node_package.zip"
}

variable lambda_api_functions_package_filename {
  default = "functions_package.zip"
}

variable auth_redirectUri {
}

variable auth_clientsecret {
}

variable auth_host {
}

variable auth_clientId {
}

locals {
  tags = {
    app = "tamtam"
    env = var.env
    own = "eb"
  }
  domain = "efog.ca"
}

module "userdatabase" {
  source = "./modules/userdatabase"
  tags   = local.tags
}

data "aws_iam_role" "tamtam_lambda_api_role" {
  name = "tamtam_lambda_api_${local.tags.env}_role"
}

data "aws_cognito_user_pools" "tamtam_aws_cognito_user_pools" {
  name = "tamtam_userpool_${local.tags.env}"
}

module "monitoring" {
  source             = "./modules/monitoring"
  tags               = local.tags
  aws_account_number = var.aws_account_number
  region             = var.region
}

module "functions" {
  source                                = "./modules/functions"
  tags                                  = local.tags
  domain                                = local.domain
  lambda_api_role                       = data.aws_iam_role.tamtam_lambda_api_role
  aws_account_number                    = var.aws_account_number
  users_table_name                      = module.userdatabase.userdata_table.name
  lambda_api_layer_package_filename     = var.lambda_api_layer_package_filename
  lambda_api_functions_package_filename = var.lambda_api_functions_package_filename
  account_number                        = var.aws_account_number
  region                                = var.region
  tamtam_aws_cognito_user_pools         = data.aws_cognito_user_pools.tamtam_aws_cognito_user_pools
  tamtam_apigateway_cloudwatch_role     = module.monitoring.tamtam_apigateway_cloudwatch_role
  tamtam_apigw_loggroup                 = module.monitoring.tamtam_apigw_loggroup
  auth_clientid                         = var.auth_clientId
  auth_host                             = var.auth_host
  auth_clientsecret                     = var.auth_clientsecret
  auth_redirectUri                      = var.auth_redirectUri
}
