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
  layer_name          = "tamtam_lambda_api_layer_${var.tags.env}"
  description         = "Tamtam lambda api layer in ${var.tags.env} environment"
  compatible_runtimes = ["nodejs12.x"]
  filename            = var.lambda_api_layer_package_filename
  source_code_hash    = filebase64sha256(var.lambda_api_layer_package_filename)
}

resource "aws_lambda_function" "lambda_api_getuserbyid" {
  filename         = var.lambda_api_functions_package_filename
  function_name    = "tamtam_getuserby_id_${var.tags.env}"
  role             = var.lambda_api_role.arn
  handler          = "lambda/users/index.getByUserId"
  tags             = var.tags
  runtime          = "nodejs12.x"
  layers           = [aws_lambda_layer_version.lambda_api_layer.arn]
  source_code_hash = filebase64sha256(var.lambda_api_functions_package_filename)
  environment {
    variables = {
      CONFIG_USERSTABLENAME = var.users_table_name
    }
  }
}

resource "aws_lambda_permission" "apigw_lambda_api_getuserbyid_permission" {
  statement_id  = "AllowExecutionGetuserbyidFromAPIGateway_${var.tags.env}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_api_getuserbyid.function_name
  principal     = "apigateway.amazonaws.com"
  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_number}:${aws_api_gateway_rest_api.tamtam_api.id}/*/${aws_api_gateway_method.method.http_method}${aws_api_gateway_resource.users.path}"
}

resource "aws_api_gateway_rest_api" "tamtam_api" {
  name = "tamtam_api_${var.tags.env}"
  tags = var.tags
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.tamtam_api.id
  resource_id   = aws_api_gateway_resource.users.id
  http_method   = "GET"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.tamtam_api_authorizer.id
}

resource "aws_api_gateway_integration" "getuserbyid_integration" {
  rest_api_id             = aws_api_gateway_rest_api.tamtam_api.id
  resource_id             = aws_api_gateway_resource.users.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_api_getuserbyid.invoke_arn
}

resource "aws_api_gateway_resource" "users" {
  path_part   = "users"
  parent_id   = aws_api_gateway_rest_api.tamtam_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.tamtam_api.id
}

resource "aws_api_gateway_authorizer" "tamtam_api_authorizer" {
  name          = "tamtam_api_authorizer_${var.tags.env}"
  rest_api_id   = aws_api_gateway_rest_api.tamtam_api.id
  type          = "COGNITO_USER_POOLS"
  provider_arns = var.tamtam_aws_cognito_user_pools.arns
}

resource "aws_api_gateway_stage" "tamtam_api_stage" {
  depends_on    = [var.tamtam_apigw_loggroup]
  deployment_id = aws_api_gateway_deployment.tamtam_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.tamtam_api.id
  stage_name    = var.tags.env
}

resource "aws_api_gateway_deployment" "tamtam_api_deployment" {
  depends_on  = [aws_api_gateway_integration.getuserbyid_integration]
  rest_api_id = aws_api_gateway_rest_api.tamtam_api.id
  stage_name  = var.tags.env
}

resource "aws_api_gateway_account" "tamtam_api_account" {
  cloudwatch_role_arn = var.tamtam_apigateway_cloudwatch_role
}
