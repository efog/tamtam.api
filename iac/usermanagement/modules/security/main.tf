resource "aws_iam_role" "tamtam_lambda_api_role" {
  name               = "tamtam_lambda_api_${var.tags.env}_role"
  assume_role_policy = file("${path.module}/policies/tamtamlambdarole.iampolicy.json")
  description        = "Tamtam API role for Lambda resources in ${var.tags.env} environment"
  tags               = var.tags
}

resource "aws_iam_role" "tamtam_cognito_role" {
  name               = "tamtam_cognito_${var.tags.env}_role"
  assume_role_policy = file("${path.module}/policies/tamtamcognitorole.iampolicy.json")
  description        = "Tamtam role for cognito resources in ${var.tags.env} environment"
  tags               = var.tags
}

resource "aws_iam_policy" "cognito_access_ses_policy" {
  name        = "cognito_access_ses_policy_${var.tags.env}"
  description = "A policy allowing cognito to access SES identities in ${var.tags.env} environment"
  policy      = replace(replace(file("${path.module}/policies/tamtamsessendemail.iampolicy.json"), "#{account_number}", var.aws_account_number), "#{region}", var.region)
}

resource "aws_iam_role_policy_attachment" "cognito_access_ses_policy_attachment" {
  role       = aws_iam_role.tamtam_cognito_role.name
  policy_arn = aws_iam_policy.cognito_access_ses_policy.arn
}