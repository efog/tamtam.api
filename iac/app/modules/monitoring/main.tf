resource "aws_cloudwatch_log_group" "tamtam_apigw_loggroup" {
  name              = "tamtam_apigw_loggroup_${var.tags.env}"
  tags              = var.tags
  retention_in_days = 5
}

resource "aws_cloudwatch_log_stream" "tamtam_apigw_logggroup_stream" {
  log_group_name = aws_cloudwatch_log_group.tamtam_apigw_loggroup.name
  name           = "tamtam_apigw_logggroup_stream_${var.tags.env}"
}

resource "aws_iam_role" "tamtam_apigateway_cloudwatch_role" {
  description        = "role for api gateway for cloudwatch logging"
  name               = "tamtam_apigateway_cloudwatch_role"
  assume_role_policy = file("${path.module}/policies/tamtamapigwcwrole.iampolicy.json")
  tags               = var.tags
}

resource "aws_iam_policy" "tamtam_apigateway_cloudwatch_policy" {
  description = "policy allowing tamtam api gateway to write to loggroup"
  name        = "tamtam_apigateway_cloudwatch_policy_${var.tags.env}"
  policy = replace(
    replace(
      replace(
        replace(
          file("${path.module}/policies/tamtamapigwcwrolepermissions.iampolicy.json"), "#{region}", var.region
        )
        , "#{account_number}", var.aws_account_number
      )
    , "#{log_group}", aws_cloudwatch_log_group.tamtam_apigw_loggroup.name)
  , "#{log_stream}", aws_cloudwatch_log_stream.tamtam_apigw_logggroup_stream.name)
}

resource "aws_iam_role_policy_attachment" "tamtam_apigateway_cloudwatch_role_policy" {
  policy_arn = aws_iam_policy.tamtam_apigateway_cloudwatch_policy.arn
  role       = aws_iam_role.tamtam_apigateway_cloudwatch_role.name
}
