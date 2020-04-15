resource "aws_iam_policy" "lambda_users_table_access_policy" {
  name        = "lambda_users_table_${var.tags.env}_access_policy"
  description = "A policy allowing lambda functions to access userstable in DynamoDB in ${var.tags.env} environment"
  policy      = replace(replace(file("${path.module}/policies/userstableaccess.iampolicy.json"), "#{account_number}", var.aws_account_number), "#{table_name}", var.users_table_name)
}

data "aws_iam_policy" "default_lambda_policy" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_users_table_access_policy_attachment" {
  role       = var.lambda_api_role.name
  policy_arn = aws_iam_policy.lambda_users_table_access_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_users_default_lambda_policy_attachment" {
  role       = var.lambda_api_role.name
  policy_arn = data.aws_iam_policy.default_lambda_policy.arn
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
  function_name    = "tamtam_getuserbyid_${var.tags.env}"
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

resource "aws_lambda_function" "lambda_api_getaccesstoken" {
  filename         = var.lambda_api_functions_package_filename
  function_name    = "tamtam_getaccesstoken_${var.tags.env}"
  role             = var.lambda_api_role.arn
  handler          = "lambda/tokens/index.getAccessToken"
  tags             = var.tags
  runtime          = "nodejs12.x"
  layers           = [aws_lambda_layer_version.lambda_api_layer.arn]
  source_code_hash = filebase64sha256(var.lambda_api_functions_package_filename)
  environment {
    variables = {
      CONFIG_AUTH_HOST         = var.auth_host
      CONFIG_AUTH_CLIENTID     = var.auth_clientid
      CONFIG_AUTH_CLIENTSECRET = var.auth_clientsecret
      CONFIG_AUTH_REDIRECT_URI = var.auth_redirectUri
    }
  }
  timeout = 10
}

resource "aws_lambda_permission" "apigw_lambda_api_getuserbyid_permission" {
  statement_id  = "AllowExecutionGetuserbyidFromAPIGateway_${var.tags.env}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_api_getuserbyid.function_name
  principal     = "apigateway.amazonaws.com"
  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_number}:${aws_api_gateway_rest_api.tamtam_api.id}/*/*${aws_api_gateway_resource.users.path}"
}

resource "aws_lambda_permission" "apigw_lambda_api_getaccesstoken_permission" {
  statement_id  = "AllowExecutionGetAccessTokenFromAPIGateway_${var.tags.env}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_api_getaccesstoken.function_name
  principal     = "apigateway.amazonaws.com"
  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${var.region}:${var.account_number}:${aws_api_gateway_rest_api.tamtam_api.id}/*/*${aws_api_gateway_resource.tokens.path}"
}

resource "aws_api_gateway_rest_api" "tamtam_api" {
  name = "tamtam_api_${var.tags.env}"
  tags = var.tags
}

resource "aws_api_gateway_method" "get_users_method" {
  rest_api_id          = aws_api_gateway_rest_api.tamtam_api.id
  resource_id          = aws_api_gateway_resource.users.id
  http_method          = "GET"
  authorization        = "COGNITO_USER_POOLS"
  authorizer_id        = aws_api_gateway_authorizer.tamtam_api_authorizer.id
  authorization_scopes = ["https://${var.tags.env}.api.tamtam.${var.domain}/api.access"]
}

resource "aws_api_gateway_model" "get_accesstoken_model" {
  rest_api_id  = "${aws_api_gateway_rest_api.tamtam_api.id}"
  name         = "autorizationcode"
  description  = "JSON schema for access token request"
  content_type = "application/json"

  schema = <<EOF
  {
    "code": "string"
  }
  EOF
}

resource "aws_api_gateway_request_validator" "get_accesstoken_request_validator" {
  name                        = "get_accesstoken_request_validator"
  rest_api_id                 = "${aws_api_gateway_rest_api.tamtam_api.id}"
  validate_request_body       = true
  validate_request_parameters = false
}


resource "aws_api_gateway_method" "get_accesstoken_method" {
  rest_api_id   = aws_api_gateway_rest_api.tamtam_api.id
  resource_id   = aws_api_gateway_resource.tokens.id
  http_method   = "POST"
  authorization = "NONE"
  request_models = {
    "application/json" = aws_api_gateway_model.get_accesstoken_model.name
  }
  request_validator_id = aws_api_gateway_request_validator.get_accesstoken_request_validator.id
}

resource "aws_api_gateway_integration" "getuserbyid_integration" {
  rest_api_id             = aws_api_gateway_rest_api.tamtam_api.id
  resource_id             = aws_api_gateway_resource.users.id
  http_method             = aws_api_gateway_method.get_users_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_api_getuserbyid.invoke_arn
}

resource "aws_api_gateway_integration" "getaccesstoken_integration" {
  rest_api_id             = aws_api_gateway_rest_api.tamtam_api.id
  resource_id             = aws_api_gateway_resource.tokens.id
  http_method             = aws_api_gateway_method.get_accesstoken_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.lambda_api_getaccesstoken.invoke_arn
}

resource "aws_api_gateway_resource" "users" {
  path_part   = "users"
  parent_id   = aws_api_gateway_rest_api.tamtam_api.root_resource_id
  rest_api_id = aws_api_gateway_rest_api.tamtam_api.id
}

resource "aws_api_gateway_resource" "tokens" {
  path_part   = "tokens"
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
  tags          = var.tags
  access_log_settings {
    destination_arn = var.tamtam_apigw_loggroup.arn
    format          = "$context.identity.sourceIp $context.identity.caller $context.identity.user [$context.requestTime] '$context.httpMethod $context.resourcePath $context.protocol' $context.status $context.responseLength $context.requestId"
  }
}

resource "aws_api_gateway_deployment" "tamtam_api_deployment" {
  depends_on  = [aws_api_gateway_integration.getuserbyid_integration, aws_api_gateway_integration.getaccesstoken_integration]
  rest_api_id = aws_api_gateway_rest_api.tamtam_api.id
}

resource "aws_api_gateway_account" "tamtam_api_account" {
  cloudwatch_role_arn = var.tamtam_apigateway_cloudwatch_role.arn
}
