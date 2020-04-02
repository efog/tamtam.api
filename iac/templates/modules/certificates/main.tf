resource "aws_acm_certificate" "cert" {
  domain_name       = "*.${var.domain}"
  validation_method = "DNS"

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "users_cert" {
  domain_name       = "${var.tags.env}.auth.${var.domain}"
  validation_method = "DNS"

  tags = var.tags

  lifecycle {
    create_before_destroy = true
  }

}

data "aws_route53_zone" "domain_zone" {
  name = var.domain
}

resource "aws_route53_record" "cert_validation_record" {
  name    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.domain_zone.id
  records = [aws_acm_certificate.cert.domain_validation_options.0.resource_record_value]
  ttl     = 60
}

resource "aws_route53_record" "users_cert_validation_record" {
  name    = aws_acm_certificate.users_cert.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.users_cert.domain_validation_options.0.resource_record_type
  zone_id = data.aws_route53_zone.domain_zone.id
  records = [aws_acm_certificate.users_cert.domain_validation_options.0.resource_record_value]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "cert_validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [aws_route53_record.cert_validation_record.fqdn]
}

resource "aws_acm_certificate_validation" "users_cert_validation" {
  certificate_arn         = aws_acm_certificate.users_cert.arn
  validation_record_fqdns = [aws_route53_record.users_cert_validation_record.fqdn]
}
