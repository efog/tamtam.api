data "aws_route53_zone" "domain_zone" {
  name = var.domain
}

resource "aws_route53_record" "users_domain_a_record" {
  name    = "auth.${var.domain}"
  type    = "A"
  zone_id = data.aws_route53_zone.domain_zone.id
  records = ["1.1.1.1"]
  ttl     = 60
}

resource "aws_cognito_user_pool" "pool" {
  name = "tamtam_userpool_${var.tags.env}"
  tags = var.tags
  email_configuration {
    email_sending_account = "DEVELOPER"
    source_arn            = "arn:aws:ses:${var.region}:${var.aws_account_number}:identity/userpool.${var.tags.env}@efog.ca"
  }
}

resource "aws_cognito_user_pool_domain" "main" {
  depends_on      = [aws_route53_record.users_domain_a_record]
  domain          = "${var.tags.env}.auth.${var.domain}"
  certificate_arn = var.tamtam_domain_acm_certificate.arn
  user_pool_id    = aws_cognito_user_pool.pool.id
}
