resource "aws_ses_domain_mail_from" "tamtam_app_domain_mail_from" {
  domain           = aws_ses_domain_identity.tamtam_app_ses_domain_identity.domain
  mail_from_domain = "bounce.${aws_ses_domain_identity.tamtam_app_ses_domain_identity.domain}"
}

# Example SES Domain Identity
resource "aws_ses_domain_identity" "tamtam_app_ses_domain_identity" {
  domain = var.domain
}

resource "aws_ses_identity_policy" "tamtam_ses_identity_policy" {
  identity = aws_ses_email_identity.tamtam_app_ses_email_identity.arn
  name     = "tamtam_ses_identity_policy_${var.tags.env}"
  policy   = replace(replace(replace(file("${path.module}/policies/tamtamsesidentity.iampolicy.json"), "#{account_number}", var.aws_account_number), "#{region}", var.region), "#{email}", "userpool.${var.tags.env}@${var.domain}")
}

resource "aws_ses_email_identity" "tamtam_app_ses_email_identity" {
  email = "userpool.${var.tags.env}@${var.domain}"
}

data "aws_route53_zone" "domain_zone" {
  name    = var.domain
}

resource "aws_route53_record" "tamtam_app_ses_domain_identity_verification_record" {
  zone_id = data.aws_route53_zone.domain_zone.id
  name    = "_amazonses.${var.domain}"
  type    = "TXT"
  ttl     = "600"
  records = [aws_ses_domain_identity.tamtam_app_ses_domain_identity.verification_token]
}

resource "aws_route53_record" "ses_domain_mail_from_mx" {
  zone_id = data.aws_route53_zone.domain_zone.id
  name    = aws_ses_domain_mail_from.tamtam_app_domain_mail_from.mail_from_domain
  type    = "MX"
  ttl     = "600"
  records = ["10 feedback-smtp.${var.region}.amazonses.com"] # Change to the region in which `aws_ses_domain_identity.example` is created
}