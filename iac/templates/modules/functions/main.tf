resource "aws_iam_policy" "lambda_users_table_access_policy" {
  name        = "lambda_users_table_${var.tags.env}_access_policy"
  description = "A policy allowing lambda functions to access userstable in DynamoDB in ${var.tags.env} environment"
  policy      = replace(replace(file("${path.module}/policies/userstableaccess.iampolicy.json"), "#{account_number}", var.aws_account_number), "#{table_name}", var.users_table_name)
}

resource "aws_iam_role_policy_attachment" "lambda_users_table_access_policy_attachment" {
  role       = var.lambda_api_role.name
  policy_arn = aws_iam_policy.lambda_users_table_access_policy.arn
}

resource "aws_lambda_layer_version" "lambda_api_layer" {
  layer_name          = "lambda_api_layer_${var.tags.env}"
  description         = "lambda api layer in ${var.tags.env} environment"
  compatible_runtimes = ["nodejs12.x"]
  filename            = var.lambda_api_layer_package_filename
}

resource "aws_lambda_function" "lambda_api_getuserbyid" {
  filename      = var.lambda_api_functions_package_filename
  function_name = "tamtam_getuserby_id_${var.tags.env}"
  role          = var.lambda_api_role.arn
  handler       = "lambda/users/index.getByUserId"
  tags          = var.tags
  runtime       = "nodejs12.x"
  layers        = [aws_lambda_layer_version.lambda_api_layer.arn]
  environment {
    variables = {
      CONFIG_USERSTABLENAME = var.users_table_name
    }
  }
}
