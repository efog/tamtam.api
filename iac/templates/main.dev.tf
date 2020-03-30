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

locals {
  tags = {
    app = "tamtam"
    env = "dev"
    own = "eb"
  }
}

module "userdatabase" {
  source = "./modules/userdatabase"
  tags   = local.tags
}

output "userdata_table" {
  value = module.userdatabase.userdata_table
}