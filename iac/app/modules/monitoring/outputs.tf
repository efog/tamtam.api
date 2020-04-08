output tamtam_apigateway_cloudwatch_role {
    value = aws_iam_role.tamtam_apigateway_cloudwatch_role
}

output tamtam_apigw_loggroup {
    value = aws_cloudwatch_log_group.tamtam_apigw_loggroup
}