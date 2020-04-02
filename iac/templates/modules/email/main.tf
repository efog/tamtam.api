resource "aws_ses_domain_mail_from" "tamtam_app_domain_mail_from" {
  domain           = aws_ses_domain_identity.tamtam_app_ses_domain_identity.domain
  mail_from_domain = "bounce.${aws_ses_domain_identity.tamtam_app_ses_domain_identity.domain}"
}

# Example SES Domain Identity
resource "aws_ses_domain_identity" "tamtam_app_ses_domain_identity" {
  domain = var.domain
}

resource "aws_ses_email_identity" "tamtam_app_ses_email_identity" {
  email = "userpool@${var.domain}"
}

data "aws_route53_zone" "domain_zone" {
  name    = var.domain
  private = false
}

resource "aws_route53_record" "example_ses_domain_mail_from_mx" {
  zone_id = "${data.aws_route53_zone.domain_zone.id}"
  name    = "${aws_ses_domain_mail_from.tamtam_app_domain_mail_from}"
  type    = "MX"
  ttl     = "600"
  records = ["10 feedback-smtp.${var.region}.amazonses.com"] # Change to the region in which `aws_ses_domain_identity.example` is created
}

resource "aws_route53_record" "example_ses_domain_mail_from_txt" {
  zone_id = "${data.aws_route53_zone.domain_zone.id}"
  name    = "${aws_ses_domain_mail_from.tamtam_app_domain_mail_from.mail_from_domain}"
  type    = "TXT"
  ttl     = "600"
  records = ["v=spf1 include:amazonses.com -all"]
}