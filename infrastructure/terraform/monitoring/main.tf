resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "urban-ride-system-metrics"
  dashboard_body = <<EOF
{
  "widgets": []
}
EOF
}
