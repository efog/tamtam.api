provider "aws" {
  region  = "us-east-1"
  alias   = "cac1"
  version = "~> 2.7"
}

terraform {
  backend "s3" {
    bucket = "locomotive10.iac.use1.terraform"
    key    = "tamtam.cognito.dev.tfstate"
    region = "us-east-1"
  }
}

locals {
  tags = {
    app = "tamtam"
    env = var.env
    own = "eb"
  }
  domain = "efog.ca"
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