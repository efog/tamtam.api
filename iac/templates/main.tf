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

locals {
  tags = {
    app = "tamtam"
    env = var.env
    own = "eb"
  }
  domain = "efog.ca"
}

module "security" {
  source             = "./modules/security"
  tags               = local.tags
  region             = var.region
  aws_account_number = var.aws_account_number
}

module "emailservice" {
  source             = "./modules/email"
  domain             = local.domain
  region             = var.region
  tags               = local.tags
  aws_account_number = var.aws_account_number
}

module "certificates" {
  source = "./modules/certificates"
  tags   = local.tags
  domain = local.domain
}

module "userpool" {
  source                         = "./modules/userpool"
  domain                         = local.domain
  tags                           = local.tags
  region                         = var.region
  aws_account_number             = var.aws_account_number
  tamtam_app_ses_domain_identity = module.emailservice.tamtam_app_ses_domain_identity
  tamtam_domain_acm_certificate  = module.certificates.tamtam_domain_acm_users_certificate
  tamtam_app_domain_mail_from    = module.emailservice.tamtam_app_domain_mail_from
  tamtam_cognito_role            = module.security.tamtam_cognito_role
}

module "userdatabase" {
  source = "./modules/userdatabase"
  tags   = local.tags
}

module "functions" {
  source                                = "./modules/functions"
  tags                                  = local.tags
  lambda_api_role                       = module.security.tamtam_lambda_api_role
  aws_account_number                    = var.aws_account_number
  users_table_name                      = module.userdatabase.userdata_table.name
  lambda_api_layer_package_filename     = var.lambda_api_layer_package_filename
  lambda_api_functions_package_filename = var.lambda_api_functions_package_filename
  account_number                        = var.aws_account_number
  region                                = var.region
  tamtam_aws_cognito_user_pool          = module.userpool.tamtam_aws_cognito_user_pool
}

output "userdata_table" {
  value = module.userdatabase.userdata_table
}

output "tamtam_lambda_api_role" {
  value = module.security.tamtam_lambda_api_role
}

output "tamtam_app_ses_domain_identity" {
  value = module.emailservice.tamtam_app_ses_domain_identity
}
