resource "aws_iam_role" "lambda_tamtam_api_role" {
  name               = "lambda_tamtam_api_${var.tags.env}_role"
  assume_role_policy = file("${path.module}/policies/lambdapirole.iampolicy.json")
  description        = "Tamtam API role for Lambda resources in ${var.tags.env} environment"
  tags               = var.tags
}
