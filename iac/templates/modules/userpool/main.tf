resource "aws_cognito_user_pool" "pool" {
  name                          = "tamtam_userpool_${var.tags.env}"
  tags                          = var.tags
  verification_message_template = {}
}
