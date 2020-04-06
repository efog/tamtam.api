resource "random_id" "userdatabaseid" {
  byte_length = 8
}

resource "aws_dynamodb_table" "userdata" {
  name         = "userdata.${var.tags.env}.${random_id.userdatabaseid.hex}"
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
