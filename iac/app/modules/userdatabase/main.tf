resource "aws_dynamodb_table" "userdata" {
  name         = "userdata.${var.tags.env}.${var.appid}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"
  range_key    = "doctype"
  attribute {
    name = "userId"
    type = "S"
  }
  attribute {
    name = "doctype"
    type = "S"
  }
  tags = var.tags
}
