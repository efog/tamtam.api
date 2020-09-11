resource "aws_iam_role" "tamtam_appsync_datasource_role" {
  description        = "role for appsync graphql api"
  name               = "tamtam_${var.tags.env}_appsync_datasource_role"
  assume_role_policy = file("${path.module}/policies/tamtamappsyncrole.iampolicy.json")
  tags               = var.tags
}


resource "aws_appsync_graphql_api" "tamtam_appsync_graphql_api" {
  authentication_type = "AMAZON_COGNITO_USER_POOLS"
  name                = "tamtam.graphapi.${var.tags.env}.${var.appid}"

  user_pool_config {
    aws_region     = data.aws_region.current.name
    default_action = "DENY"
    user_pool_id   = var.cognito_userpool_id
  }
}

resource "aws_appsync_datasource" "tamtam_appsync_datasource" {
  api_id           = aws_appsync_graphql_api.tamtam_appsync_graphql_api.id
  name             = "tamtam_${var.tags.env}_${var.appid}_appsync_datasource"
  service_role_arn = aws_iam_role.example.arn
  type             = "AMAZON_DYNAMODB"

  dynamodb_config {
    table_name = aws_dynamodb_table.example.name
  }
}