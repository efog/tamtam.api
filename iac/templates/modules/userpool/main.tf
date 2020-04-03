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
  admin_create_user_config {
    invite_message_template {
      email_message = file("${path.module}/templates/emailinvitetemplate.html")
      email_subject = "Your invitation to register at Tamtam"
      sms_message   = file("${path.module}/templates/smsinvitetemplate.txt")
    }
  }
  username_attributes = ["email"]
  email_configuration {
    email_sending_account = "DEVELOPER"
    source_arn            = "arn:aws:ses:${var.region}:${var.aws_account_number}:identity/userpool.${var.tags.env}@${var.domain}"
  }
  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = false  // false for "sub"
    required                 = true // true for "sub"
    string_attribute_constraints {   // if it's a string
      min_length = 0                 // 10 for "birthdate"
      max_length = 2048              // 10 for "birthdate"
    }
  }
  schema {
    name                     = "family_name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true  // false for "sub"
    required                 = false // true for "sub"
    string_attribute_constraints {   // if it's a string
      min_length = 0                 // 10 for "birthdate"
      max_length = 2048              // 10 for "birthdate"
    }
  }
  schema {
    name                     = "given_name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true  // false for "sub"
    required                 = false // true for "sub"
    string_attribute_constraints {   // if it's a string
      min_length = 0                 // 10 for "birthdate"
      max_length = 2048              // 10 for "birthdate"
    }
  }
  schema {
    name                     = "middle_name"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true  // false for "sub"
    required                 = false // true for "sub"
    string_attribute_constraints {   // if it's a string
      min_length = 0                 // 10 for "birthdate"
      max_length = 2048              // 10 for "birthdate"
    }
  }
  schema {
    name                     = "birthday"
    attribute_data_type      = "DateTime"
    developer_only_attribute = false
    mutable                  = true  // false for "sub"
    required                 = false // true for "sub"
    string_attribute_constraints {   // if it's a string
      min_length = 0                 // 10 for "birthdate"
      max_length = 2048              // 10 for "birthdate"
    }
  }
  schema {
    name                     = "phone_number"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true  // false for "sub"
    required                 = false // true for "sub"
    string_attribute_constraints {   // if it's a string
      min_length = 0                 // 10 for "birthdate"
      max_length = 2048              // 10 for "birthdate"
    }
  }
}

resource "aws_cognito_user_pool_domain" "default_domain" {
  depends_on      = [aws_route53_record.users_domain_a_record]
  domain          = "${var.tags.env}.auth.${var.domain}"
  certificate_arn = var.tamtam_domain_acm_certificate.arn
  user_pool_id    = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool_domain" "main_domain" {
  domain       = "${var.tags.env}-auth-efog-ca"
  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_resource_server" "api_resource" {
  identifier = "https://${var.tags.env}.api.tamtam.${var.domain}"
  name       = "${var.tags.env}.tamtam"
  scope {
    scope_name        = "api.access"
    scope_description = "Access API"
  }
  scope {
    scope_name        = "user.read"
    scope_description = "read user"
  }
  scope {
    scope_name        = "user.write"
    scope_description = "write user"
  }
  user_pool_id = "${aws_cognito_user_pool.pool.id}"
}
