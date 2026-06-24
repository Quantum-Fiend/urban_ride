resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "16.1"
  instance_class       = "db.t4g.micro"
  db_name              = "urban_ride"
  username             = var.db_user
  password             = var.db_password
  skip_final_snapshot  = true
}
