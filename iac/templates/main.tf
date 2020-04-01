provider "aws" {
  region  = "ca-central-1"
  alias   = "cac1"
  version = "~> 2.7"
}

terraform {
  backend "s3" {
    bucket = "locomotive10.iac.terraform"
    key    = "tamtam.dev.tfstate"
    region = "ca-central-1"
  }
}

variable region {
  default = "ca-central-1"
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

locals {
  tags = {
    app = "tamtam"
    env = var.env
    own = "eb"
  }
}

module "security" {
  source = "./modules/security"
  tags   = local.tags
}

module "userdatabase" {
  source = "./modules/userdatabase"
  tags   = local.tags
}

module "functions" {
  source                                = "./modules/functions"
  tags                                  = local.tags
  lambda_api_role                       = module.security.lambda_tamtam_api_role
  aws_account_number                    = var.aws_account_number
  users_table_name                      = module.userdatabase.userdata_table.name
  lambda_api_layer_package_filename     = var.lambda_api_layer_package_filename
  lambda_api_functions_package_filename = var.lambda_api_functions_package_filename
  account_number                        = var.aws_account_number
  region                                = var.region
}

output "userdata_table" {
  value = module.userdatabase.userdata_table
}

output "lambda_tamtam_api_role" {
  value = module.security.lambda_tamtam_api_role
}
